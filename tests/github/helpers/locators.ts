import { Page } from "@playwright/test";
import { selectors } from "../common/selectors";
import { texts } from "../common/texts";

export const locators = {
  signIn: (page: Page) => page.getByText(texts.signIn),
  twoFactor: (page: Page) => page.getByText(texts.twoFactor),
  errorAlert: (page: Page) => page.getByText(texts.incorrectEmailOrPassword),
  recoveryFailedAlert: (page: Page) => page.getByText(texts.recoveryCodeFailed),
  dashboard: (page: Page) => page.getByRole('link', {
    name: texts.dashboard,
  }),
  searchBtn: (page: Page) => page.getByRole('button', {
    name: 'Type / to search',
  }),
  typescriptRepo: (page: Page) =>  page.locator(
    selectors.typescriptRepo,
  ),
  linkURL: (page: Page) => page.locator(selectors.typescriptURL),
  copilotInput: (page: Page) => page.locator(selectors.copilotInput)
};