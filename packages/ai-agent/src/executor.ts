import { Page } from "playwright";
import { AgentStep, StepResult } from "./types";
import { takeScreenshot } from "./browser";

export async function executeStep(
  page: Page,
  step: AgentStep,
  stepIndex: number,
  sessionId: string
): Promise<StepResult> {
  try {
    switch (step.action) {
      case "navigate":
        await page.goto(step.url!, { waitUntil: "domcontentloaded", timeout: 10000 });
        break;

      case "click":
        await page.click(step.selector!, { timeout: 5000 });
        break;

      case "type":
        if (step.selector) {
          await page.fill(step.selector, step.value || "");
        }
        break;

      case "wait":
        await page.waitForTimeout(parseInt(step.value || "1000"));
        break;

      case "evaluate":
        if (step.script) {
          await page.evaluate(step.script);
        }
        break;

      case "screenshot":
        // Just take a screenshot, no other action
        break;
    }

    // Take screenshot after every action
    const screenshot = await takeScreenshot(page);

    return {
      sessionId,
      stepIndex,
      action: step.action,
      explanation: step.explanation,
      screenshot,
      success: true,
      pageUrl: page.url(),
      pageTitle: await page.title(),
    };
  } catch (err: any) {
    const screenshot = await takeScreenshot(page).catch(() => undefined);
    return {
      sessionId,
      stepIndex,
      action: step.action,
      explanation: step.explanation,
      screenshot,
      success: false,
      error: err.message,
      pageUrl: page.url(),
    };
  }
}
