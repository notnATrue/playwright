import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { selectors } from './common/selectors';
import { texts } from './common/texts';
import { locatorSelect } from './helpers/locator-select'
import { config } from './config/config'

dotenv.config();

test.describe('Login into Github', async () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = '/login';

    await page.goto(loginPage);
  });

  const userMock = {
    email: config.email,
    password: config.password,
    wrongPassword: 'WrongPassword123'
  };

  test('Should main text to be visible', async ({ page }) => {
    await expect(page.getByText(texts.signIn)).toBeVisible();
  });

  test('Should login into account', async ({ page }) => {
    const login = await locatorSelect(page, selectors.login)
    await login.fill(userMock.email);
    const password = await locatorSelect(page, selectors.password)
    await password.fill(userMock.password);
    const signIn = await locatorSelect(page, selectors.signIn)
    await signIn.click();

    await expect(page.getByText(texts.twoFactor)).toBeVisible();
  });

  test('Should show alert when login with wrong cred', async ({ page }) => {
    const login = await locatorSelect(page, selectors.login)
    await login.fill(userMock.email);
    const password = await locatorSelect(page, selectors.password)
    await password.fill(userMock.wrongPassword);
    const signIn = await locatorSelect(page, selectors.signIn)
    signIn.click()

    await expect(page.getByText(texts.incorrectEmailOrPassword)).toBeVisible();
  });
});


