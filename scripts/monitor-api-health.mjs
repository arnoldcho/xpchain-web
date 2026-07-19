#!/usr/bin/env node

/**
 * Lightweight API health monitor for PM2.
 *
 * Checks configured endpoints and pings Healthchecks.io only when all checks pass.
 * If any check fails, sends a failure ping.
 */
import dns from "node:dns";
import http from "node:http";
import https from "node:https";

try {
  // Prevent IPv6-first resolution issues on servers without outbound IPv6.
  dns.setDefaultResultOrder("ipv4first");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[monitor-api-health] failed to set DNS result order: ${message}`);
}

const BASE_URL = process.env.MONITOR_BASE_URL ?? "http://127.0.0.1:3000";
const STATUS_PATHS = (process.env.MONITOR_PATHS ?? "/api/status,/api/explorer/live")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

const CHECK_INTERVAL_MS = Math.max(
  30_000,
  Number.parseInt(process.env.MONITOR_INTERVAL_MS ?? "60000", 10) || 60_000
);
const HTTP_TIMEOUT_MS = Math.max(
  3_000,
  Number.parseInt(process.env.MONITOR_TIMEOUT_MS ?? "10000", 10) || 10_000
);

const HC_PING_URL = process.env.HEALTHCHECKS_PING_URL ?? "";

function log(message) {
  const ts = new Date().toISOString();
  console.log(`[monitor-api-health] ${ts} ${message}`);
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { method: "GET", cache: "no-store", signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * A dead RPC node still yields HTTP 200 — the endpoints answer with mock
 * numbers and dataSource "fallback". Status-code-only checks reported healthy
 * the whole time the node was down, so inspect the payload too.
 */
function findFallbackSource(payload) {
  if (!payload || typeof payload !== "object") return false;
  if (payload.dataSource === "fallback") return true;
  return Object.values(payload).some(
    (value) => value && typeof value === "object" && findFallbackSource(value)
  );
}

async function checkEndpoints() {
  for (const path of STATUS_PATHS) {
    const url = new URL(path, BASE_URL).toString();
    const response = await fetchWithTimeout(url, HTTP_TIMEOUT_MS);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} at ${url}`);
    }

    const body = await response.text();
    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      continue; // non-JSON endpoint: the status code is all we can assert
    }

    if (findFallbackSource(payload)) {
      throw new Error(`serving fallback data (RPC node unreachable) at ${url}`);
    }
  }
}

function requestWithIpv4(targetUrl, timeoutMs) {
  return new Promise((resolve, reject) => {
    const url = new URL(targetUrl);
    const client = url.protocol === "https:" ? https : http;
    const req = client.request(
      url,
      {
        method: "GET",
        family: 4,
        timeout: timeoutMs,
      },
      (res) => {
        res.resume();
        resolve(res.statusCode ?? 0);
      }
    );

    req.on("timeout", () => {
      req.destroy(new Error(`timeout after ${timeoutMs}ms`));
    });
    req.on("error", reject);
    req.end();
  });
}

async function pingHealthchecks(failed) {
  if (!HC_PING_URL) return;
  const target = failed ? `${HC_PING_URL}/fail` : HC_PING_URL;
  try {
    const status = await requestWithIpv4(target, HTTP_TIMEOUT_MS);
    if (status < 200 || status >= 400) {
      log(`healthchecks ping failed: HTTP ${status}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`healthchecks ping error: ${message}`);
  }
}

let running = false;

async function runOnce() {
  if (running) return;
  running = true;
  try {
    await checkEndpoints();
    await pingHealthchecks(false);
    log(`ok (${STATUS_PATHS.join(", ")})`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await pingHealthchecks(true);
    log(`fail (${message})`);
  } finally {
    running = false;
  }
}

log(
  `started: base=${BASE_URL} paths=${STATUS_PATHS.join(",")} interval=${CHECK_INTERVAL_MS}ms timeout=${HTTP_TIMEOUT_MS}ms`
);

await runOnce();
setInterval(runOnce, CHECK_INTERVAL_MS);
