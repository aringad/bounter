const { chromium } = require("playwright");

(async () => {
  const server = await chromium.launchServer({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
    port: 9222,
    host: "0.0.0.0",
  });
  console.log(`Browser server started at: ${server.wsEndpoint()}`);
})();
