import { test, expect, Locator } from '@playwright/test';
import { texts } from '../../common/texts';
import { config } from '../../config/config';
import { coordinatesDispersion } from '../../helpers/coordinates-dispersion';
import { getByText } from '../../helpers/locator-select';
import { LoginService } from '../../utils/login-service';
import { IBox, IPage, IUserEmailAndPassword } from './interface';

test.describe.configure({ mode: 'serial' });

test.describe('Login into Github', async () => {
  const { email, password, recoveryCode }: IUserEmailAndPassword = config.user;
  const wrongPassword: string = 'WrongPassword123';
  const loginPage: string = '/login';
  const cssPropertyBorderColor: string = 'border-color';
  const errorAlertBorderColor: string = 'rgb(31, 35, 40)';

  test.beforeEach(async ({ page }: IPage) => {
    await page.goto(loginPage);

    await expect(page).toHaveURL(loginPage);
  });

  test('Should sign-in text to be visible', async ({ page }: IPage) => {
    const signIn: Locator = await getByText(page, texts.signIn);

    await expect(signIn).toBeVisible();
  });

  // test('Should show alert when login with wrong cred', async ({
  //   page,
  // }: IPage) => {
  //   const expectedURL: string = '/session';
  //   const loginService = new LoginService(page);

  //   (await loginService.login(email, wrongPassword)) as void;

  //   const errorAlert: Locator = await getByText(
  //     page,
  //     texts.incorrectEmailOrPassword,
  //   );

  //   await expect(page).toHaveURL(expectedURL);
  //   await expect(errorAlert).toHaveCSS(
  //     cssPropertyBorderColor,
  //     errorAlertBorderColor,
  //   );
  //   await expect(errorAlert).toBeVisible();
  // });

  // test('Should login into account and alerting due to wrong recovery code', async ({
  //   page,
  // }: IPage) => {
  //   const expectedURL: string = '/sessions/two-factor/app';
  //   const recoveryURL: string = '/sessions/two-factor/recovery';
  //   const loginService = new LoginService(page);

  //   (await loginService.login(email, password)) as void;

  //   const twoFactor: Locator = await getByText(page, texts.twoFactor);
  //   await expect(twoFactor).toBeVisible();
  //   await expect(page).toHaveURL(expectedURL);

  //   await page.goto(recoveryURL);
  //   (await loginService.fillRecoveryCodeAndSend(recoveryCode)) as void;

  //   const recoveryFailedAlert: Locator = await getByText(
  //     page,
  //     texts.recoveryCodeFailed,
  //   );
  //   await expect(recoveryFailedAlert).toBeVisible();
  //   await expect(recoveryFailedAlert).toHaveCSS(
  //     cssPropertyBorderColor,
  //     errorAlertBorderColor,
  //   );
  //   await expect(page).toHaveURL(loginPage);
  // });

  test.describe('Loggin and searching', async () => {
    test.beforeEach(async ({ page }: IPage) => {
      const expectedURL: string = '/sessions/two-factor/app';
      const baseURL: string = 'https://github.com/';
      const loginService = new LoginService(page);

      await page.goto(loginPage);

      await expect(page).toHaveURL(loginPage);
      (await loginService.login(email, password)) as void;

      const twoFactor: Locator = await getByText(page, texts.twoFactor);
      await expect(twoFactor).toBeVisible();
      await expect(page).toHaveURL(expectedURL);

      (await loginService.fillAndSendGoogle2faCode()) as void;
      expect(page.url()).toBe(baseURL);

      const dashboard: Locator = page.getByRole('link', {
        name: texts.dashboard,
      });
      await expect(dashboard).toBeVisible();
    });

    test('Case 1: should search via github', async ({ page }: IPage) => {
      const mockText: string = 'typescript-eslint';
      const mockURL: string = '/typescript-eslint/typescript-eslint';
      const searchBtn: Locator = page.getByRole('button', {
        name: 'Type / to search',
      });

      const box: IBox = (await searchBtn.boundingBox()) as IBox;

      const { width, height } = await coordinatesDispersion(box);

      await page.mouse.click(width, height);
      await page.keyboard.type(mockText, { delay: 250 });
      await page.keyboard.press('Enter', { delay: 250 });
      await page.waitForTimeout(2000);

      const typescriptRepo = page.locator(
        "a[href='/typescript-eslint/typescript-eslint']",
      );
      await typescriptRepo.dblclick({ force: true, delay: 2000 });

      const link = page.locator(
        'a[href="link:///typescript-eslint/typescript-eslint"]',
      );

      expect(link).toBeDefined();
      await expect(page).toHaveURL(mockURL);
    });
  });
});
