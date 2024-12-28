import { Locator, Page } from '@playwright/test';

export const locatorSelect = async (
  page: Page,
  selector: string,
): Promise<Locator> => {
  return page.locator(selector);
};
    