module.exports = {
  apps: [
    {
      name: "xpchain-web",
      script: "node_modules/next/dist/bin/next",
      // 127.0.0.1 로만 바인딩 → 외부에서 :3000 직접 접근(Nginx 우회) 차단. 앞단 Nginx 만 프록시.
      args: "start -p 3000 -H 127.0.0.1",
      cwd: "/home/arnold/xpchain-web",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "xpchain-web-monitor",
      script: "scripts/monitor-api-health.mjs",
      cwd: "/home/arnold/xpchain-web",
      env: {
        NODE_ENV: "production",
        MONITOR_BASE_URL: "http://127.0.0.1:3000",
        MONITOR_PATHS: "/api/status,/api/explorer/live",
        MONITOR_INTERVAL_MS: "60000",
        MONITOR_TIMEOUT_MS: "10000",
        HEALTHCHECKS_PING_URL:
          "https://hc-ping.com/dd88f19b-5703-413b-989b-397d6b642693",
      },
    },
  ],
};
