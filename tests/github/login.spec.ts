import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { selectors } from './common/selectors';
import { texts } from './common/texts';
import { locatorSelect } from './helpers/locator-select'
import { config } from './config/config'
import { LoginService } from './utils/login-service'

dotenv.config();

test.describe('Login into Github', async () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = '/login';

    await page.goto(loginPage);
  });

  const errorAlertBorderColor = 'rgb(31, 35, 40)'
  const cssPropertyBorderColor = 'border-color';
  const wrongPassword = 'WrongPassword123'
  const userMock = {
    email: config.email,
    password: config.password,
    wrongPassword
  };

  test('Should sign-in text to be visible', async ({ page }) => {
    await expect(page.getByText(texts.signIn)).toBeVisible();
  });

    test('Should show alert when login with wrong cred', async ({ page }) => {
    const expectedURL = '/session';
    
    const loginService = new LoginService(page);

    await loginService.login(userMock.email, userMock.wrongPassword);

    const errorAlert = await page.getByText(texts.incorrectEmailOrPassword);

    await expect(page).toHaveURL(expectedURL);
    await expect(errorAlert).toHaveCSS(cssPropertyBorderColor, errorAlertBorderColor);
    await expect(errorAlert).toBeVisible();
  });

  test('Should login into account', async ({ page }) => {
    const expectedURL = '/sessions/two-factor/app';
    const recoveryURL = '/sessions/two-factor/recovery';
    const loginURL = '/login'
    const loginService = new LoginService(page);

    await loginService.login(userMock.email, userMock.password);

    await expect(page).toHaveURL(expectedURL);
    await expect(page.getByText(texts.twoFactor)).toBeVisible();

    await page.goto(recoveryURL);
    await loginService.fillRecoveryCodeAndSend(config.recoveryCode);
    
    const recoveryFailedAlert = await page.getByText(texts.recoveryCodeFailed)
    await expect(page).toHaveURL(loginURL);
    await expect(recoveryFailedAlert).toBeVisible();
    await expect(recoveryFailedAlert).toHaveCSS(cssPropertyBorderColor, errorAlertBorderColor);
  });
});


