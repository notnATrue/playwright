import { test, expect, Locator, Cookie } from '@playwright/test';
import { texts } from '../../common/texts';
import { config } from '../../config/config';
import { getByText } from '../../helpers/locator-select';
import { LoginService } from '../../services/login-service';
import { IPage, IUserEmailAndPassword } from './interface';
import { mkDir, writeFile } from '../../helpers/read-write';
import { routes } from '../../common/routes';

test.describe.configure({ mode: 'serial' });

test.describe('Login into Github', async () => {
  const { email, password, recoveryCode }: IUserEmailAndPassword = config.user;
  const wrongPassword: string = 'WrongPassword123';
  const cssPropertyBorderColor: string = 'border-color';
  const errorAlertBorderColor: string = 'rgb(31, 35, 40)';

  test.beforeEach(async ({ page }: IPage) => {
    await page.goto(routes.loginPage);

    await expect(page).toHaveURL(routes.loginPage);
  });

  test('Should sign-in text be visible', async ({ page }: IPage) => {
    const signIn: Locator = await getByText(page, texts.signIn);

    await expect(signIn).toBeVisible();
  });

  test('Should show alert when login with wrong cred', async ({
    page,
  }: IPage) => {
    const loginService = new LoginService(page);

    await loginService.login(email, wrongPassword);

    const errorAlert: Locator = await getByText(
      page,
      texts.incorrectEmailOrPassword,
    );

    await expect(page).toHaveURL(routes.session);
    await expect(errorAlert).toHaveCSS(
      cssPropertyBorderColor,
      errorAlertBorderColor,
    );
    await expect(errorAlert).toBeVisible();
  });

  test('Should login into account and alerting due to wrong recovery code', async ({
    page,
  }: IPage) => {
    const loginService = new LoginService(page);

    await loginService.login(email, password);

    const twoFactor: Locator = await getByText(page, texts.twoFactor);
    await expect(twoFactor).toBeVisible();
    await expect(page).toHaveURL(routes.twoFactor);

    await page.goto(routes.recoveryURL);
    await loginService.fillRecoveryCodeAndSend(recoveryCode);

    const recoveryFailedAlert: Locator = await getByText(
      page,
      texts.recoveryCodeFailed,
    );
    await expect(recoveryFailedAlert).toBeVisible();
    await expect(recoveryFailedAlert).toHaveCSS(
      cssPropertyBorderColor,
      errorAlertBorderColor,
    );
    await expect(page).toHaveURL(routes.loginPage);
  });

  test('Should login and store cookies', async ({ page }: IPage) => {
    const expectedURL: string = '/sessions/two-factor/app';
    const baseURL: string = 'https://github.com/';
    const dir = './tests/github/test-json';
    const filePath = `${dir}/cookies.json`;
    const loginService = new LoginService(page);

    await page.goto(routes.loginPage);

    await expect(page).toHaveURL(routes.loginPage);
    await loginService.login(email, password);

    const twoFactor: Locator = await getByText(page, texts.twoFactor);
    await expect(twoFactor).toBeVisible();
    await expect(page).toHaveURL(expectedURL);

    await loginService.fillAndSendGoogle2faCode();
    expect(page.url()).toBe(baseURL);

    const dashboard: Locator = page.getByRole('link', {
      name: texts.dashboard,
    });

    await expect(dashboard).toBeVisible();
    const cookies: Cookie[] = await page.context().cookies();

    await mkDir(dir);
    await writeFile(filePath, cookies);
  });
});
