#!/usr/bin/env node

/**
 * Lightweight API health monitor for PM2.
 *
 * Checks configured endpoints and pings Healthchecks.io only when all checks pass.
 * If any check fails, sends a failure ping.
 */

const BASE_URL = process.env.MONITOR_BASE_URL ?? "http://127.0.0.1:3000";
const STATUS_PATHS = (process.env.MONITOR_PATHS ?? "/api/status,/api/explorer/live")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

const CHECK_INTERVAL_MS = Math.max(
  30_000,
  Number.parseInt(process.env.MONITOR_INTERVAL_MS ?? "120000", 10) || 120_000
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

async function checkEndpoints() {
  for (const path of STATUS_PATHS) {
    const url = new URL(path, BASE_URL).toString();
    const response = await fetchWithTimeout(url, HTTP_TIMEOUT_MS);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} at ${url}`);
    }
  }
}

async function pingHealthchecks(failed) {
  if (!HC_PING_URL) return;
  const target = failed ? `${HC_PING_URL}/fail` : HC_PING_URL;
  try {
    const response = await fetchWithTimeout(target, HTTP_TIMEOUT_MS);
    if (!response.ok) {
      log(`healthchecks ping failed: HTTP ${response.status}`);
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
