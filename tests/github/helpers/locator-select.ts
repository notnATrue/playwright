import { Locator, Page } from '@playwright/test';

export const locatorSelect = async (
  page: Page,
  selector: string,
): Promise<Locator | null> => {
  return page.locator(selector);
};

export const getByText = async (
  page: Page,
  text: string,
): Promise<Locator | null> => {
  return page.getByText(text);
};
