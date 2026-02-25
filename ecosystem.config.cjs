module.exports = {
  apps: [
    {
      name: "xpchain-web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/Users/wonkyu/Projects/xpchain-web",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "xpchain-web-monitor",
      script: "scripts/monitor-api-health.mjs",
      cwd: "/Users/wonkyu/Projects/xpchain-web",
      env: {
        NODE_ENV: "production",
        MONITOR_BASE_URL: "http://127.0.0.1:3000",
        MONITOR_PATHS: "/api/status,/api/explorer/live",
        MONITOR_INTERVAL_MS: "120000",
        MONITOR_TIMEOUT_MS: "10000",
        HEALTHCHECKS_PING_URL:
          "https://hc-ping.com/dd88f19b-5703-413b-989b-397d6b642693",
      },
    },
  ],
};
