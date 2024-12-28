import { test, expect, Locator } from '@playwright/test';
import { texts } from '../../common/texts';
import { config } from '../../config/config';
import { getByText } from '../../helpers/locator-select';
import { LoginService } from '../../utils/login-service';
import { IPage, IUserEmailAndPassword } from './interface';

test.describe('Login into Github', async () => {
  const { email, password }: IUserEmailAndPassword = config;
  const wrongPassword: string = 'WrongPassword123';
  const loginPage: string = '/login';
  const cssPropertyBorderColor: string = 'border-color';
  const errorAlertBorderColor: string = 'rgb(31, 35, 40)';

  test.beforeEach(async ({ page }: IPage) => {
    await page.goto(loginPage);

    await expect(page).toHaveURL(loginPage);
  });

  test('Should sign-in text to be visible', async ({ page }: IPage) => {
    const signIn: Locator | null = await getByText(page, texts.signIn);

    await expect(signIn).toBeVisible();
  });

  test('Should show alert when login with wrong cred', async ({
    page,
  }: IPage) => {
    const expectedURL: string = '/session';
    const loginService = new LoginService(page);

    (await loginService.login(email, wrongPassword)) as void;

    const errorAlert: Locator | null = await getByText(
      page,
      texts.incorrectEmailOrPassword,
    );

    await expect(page).toHaveURL(expectedURL);
    await expect(errorAlert).toHaveCSS(
      cssPropertyBorderColor,
      errorAlertBorderColor,
    );
    await expect(errorAlert).toBeVisible();
  });

  test('Should login into account before google auth 2fa', async ({
    page,
  }: IPage) => {
    const expectedURL: string = '/sessions/two-factor/app';
    const loginService = new LoginService(page);

    (await loginService.login(email, password)) as void;

    const twoFactor: Locator | null = await getByText(page, texts.twoFactor);
    await expect(twoFactor).toBeVisible();
    await expect(page).toHaveURL(expectedURL);
  });

  test('Should login into account and alerting due to wrong recovery code', async ({
    page,
  }: IPage) => {
    const expectedURL: string = '/sessions/two-factor/app';
    const recoveryURL: string = '/sessions/two-factor/recovery';
    const loginService = new LoginService(page);

    (await loginService.login(email, password)) as void;

    const twoFactor: Locator | null = await getByText(page, texts.twoFactor);
    await expect(twoFactor).toBeVisible();
    await expect(page).toHaveURL(expectedURL);

    await page.goto(recoveryURL);
    await loginService.fillRecoveryCodeAndSend(config.recoveryCode);

    const recoveryFailedAlert: Locator | null = await getByText(
      page,
      texts.recoveryCodeFailed,
    );
    await expect(recoveryFailedAlert).toBeVisible();
    await expect(recoveryFailedAlert).toHaveCSS(
      cssPropertyBorderColor,
      errorAlertBorderColor,
    );
    await expect(page).toHaveURL(loginPage);
  });
});
