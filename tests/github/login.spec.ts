import { test, expect, Page, Locator } from '@playwright/test';
import { selectors } from './common/selectors';
import { texts } from './common/texts';
import { locatorSelect } from './helpers/locator-select';
import { config } from './config/config';
import { LoginService } from './utils/login-service';

test.describe('Login into Github', async () => {
  const { email, password }: { email: string, password: string } = config;
  const wrongPassword: string = 'WrongPassword123';
  const loginPage: string = '/login';
  const cssPropertyBorderColor: string = 'border-color';
  const errorAlertBorderColor: string = 'rgb(31, 35, 40)';

  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto(loginPage);
  });

  test('Should sign-in text to be visible and url match', async ({ page }: { page: Page }) => {
    const signIn: Locator = await page.getByText(texts.signIn)

    await expect(page).toHaveURL(loginPage);
    await expect(signIn).toBeVisible();
  });

  test('Should show alert when login with wrong cred', async ({ page }: { page: Page }) => {
  const expectedURL: stirng = '/session';
  const loginService = new LoginService(page);

  await loginService.login(email, wrongPassword);

  const errorAlert: Locator | null = await page.getByText(texts.incorrectEmailOrPassword);

  await expect(page).toHaveURL(expectedURL);
  await expect(errorAlert).toHaveCSS(cssPropertyBorderColor, errorAlertBorderColor);
  await expect(errorAlert).toBeVisible();
  });

  test('Should login into account before google auth 2fa', async ({ page }: { page: Page }) => {
    const expectedURL: string = '/sessions/two-factor/app';
    const loginService = new LoginService(page);

    await loginService.login(email, password);

    await expect(page).toHaveURL(expectedURL);
    await expect(page.getByText(texts.twoFactor)).toBeVisible();

  });

  test('Should login into account and alerting due to wrong recovery code', async ({ page }: { page: Page }) => {
    const expectedURL: string = '/sessions/two-factor/app';
    const recoveryURL: string = '/sessions/two-factor/recovery';
    const loginService = new LoginService(page);

    await loginService.login(email, password);

    await expect(page).toHaveURL(expectedURL);
    await expect(page.getByText(texts.twoFactor)).toBeVisible();

    await page.goto(recoveryURL);
    await loginService.fillRecoveryCodeAndSend(config.recoveryCode);

    const recoveryFailedAlert: Locator | null = await page.getByText(texts.recoveryCodeFailed)
    await expect(page).toHaveURL(loginPage);
    await expect(recoveryFailedAlert).toBeVisible();
    await expect(recoveryFailedAlert).toHaveCSS(cssPropertyBorderColor, errorAlertBorderColor);
  });
});


