import { chromium, Browser, BrowserContext, Page } from "playwright";

const CDP_URL = process.env.BROWSER_CDP_URL || "ws://chromium:9222";

let browser: Browser | null = null;

export async function connectBrowser(): Promise<Browser> {
  if (browser && browser.isConnected()) return browser;

  console.log(`Connecting to browser at ${CDP_URL}...`);
  browser = await chromium.connect(CDP_URL);
  console.log("Browser connected.");
  return browser;
}

export async function createSession(): Promise<{ context: BrowserContext; page: Page }> {
  const b = await connectBrowser();
  const context = await b.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();
  return { context, page };
}

export async function takeScreenshot(page: Page): Promise<string> {
  const buffer = await page.screenshot({ type: "jpeg", quality: 70 });
  return buffer.toString("base64");
}

export async function closeSession(context: BrowserContext): Promise<void> {
  await context.close();
}
