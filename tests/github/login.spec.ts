import { test, expect, describe } from '@playwright/test';
import dotenv from 'dotenv';
import { selectors } from '../../common/selectors';
import { texts } from '../../common/texts'

dotenv.config();

describe('Login into Github', async () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = '/login';

    await page.goto(loginPage);
  });

  const userMock = {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    wrongPassword: process.env.WRONG_PASSWORD
  };

  test('Should main text to be visible', async ({ page }) => {
    await expect(page.getByText(texts.signIn)).toBeVisible();
  });

  test('Should login into account', async ({ page }) => {
    await page.locator(selectors.login).fill(userMock.email);
    await page.locator(selectors.password).fill(userMock.password);
    await page.locator(selectors.signIn).click();

    await expect(page.getByText(texts.twoFactor)).toBeVisible();
  });

  test('Should show alert when login with wrong cred', async ({ page }) => {
    await page.locator(selectors.login).fill(userMock.email);
    await page.locator(selectors.password).fill(userMock.wrongPassword);
    await page.locator(selectors.signIn).click();

    await expect(page.getByText(texts.incorrectEmailOrPassword)).toBeVisible();
  });
});


