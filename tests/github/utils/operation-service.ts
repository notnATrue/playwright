import { Page } from "@playwright/test";

export class OperationService {
  async clickOnSearchAndType(page: Page, width: number, height: number, mockText: string) {
    await page.mouse.click(width, height);
    await page.keyboard.type(mockText, { delay: 250 });
    await page.keyboard.press('Enter', { delay: 250 });
    await page.waitForTimeout(2000);
  }
}
