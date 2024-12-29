export class OperationService {
  async clickOnSearchAndType(page, width, height, mockText) {
    await page.mouse.click(width, height);
    await page.keyboard.type(mockText, { delay: 250 });
    await page.keyboard.press('Enter', { delay: 250 });
    await page.waitForTimeout(2000);
  }
}