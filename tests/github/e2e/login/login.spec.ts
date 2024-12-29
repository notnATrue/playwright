import { test, expect, Locator, Cookie } from '@playwright/test';
import { config } from '../../config/config';
import { LoginService } from '../../services/login-service';
import { IPage, IUserEmailAndPassword } from './interface';
import { mkDir, writeFile, readFile } from '../../helpers/read-write';
import { routes } from '../../common/routes';
import { locators } from '../../helpers/locators';
import { logger } from '../../transports/winston';

test.describe.configure({ mode: 'serial' });

test.describe('Login into Github', async () => {
  let loginService: LoginService;
  const { email, password, recoveryCode }: IUserEmailAndPassword = config.user;
  const mocks = {
    credential: {
      wrongPassword: 'WrongPassword123',
    },
    css: {
      borderColor: 'border-color',
      errorAlertBorderColor: 'rgb(31, 35, 40)',
    },
    sessionParams: {
      loggedIn: 'logged_in',
      yes: 'yes',
    },
  };
  const dirPaths = {
    cookiesDir: './tests/github/test-json',
    cookiesFile: './tests/github/test-json/cookies.json',
  };

  test.beforeEach(async ({ page }: IPage) => {
    loginService = new LoginService(page);

    await page.goto(routes.loginPage);

    await expect(page).toHaveURL(routes.loginPage);
  });

  test('Should sign-in text be visible', async ({ page }: IPage) => {
    const signIn: Locator = locators.signIn(page);

    await expect(signIn).toBeVisible();
  });

  test('Should show alert when login with wrong cred', async ({
    page,
  }: IPage) => {
    await loginService.login(email, mocks.credential.wrongPassword);

    const errorAlert: Locator = locators.errorAlert(page);

    await expect(page).toHaveURL(routes.session);
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toHaveCSS(
      mocks.css.borderColor,
      mocks.css.errorAlertBorderColor,
    );
  });

  test('Should login into account and alerting due to wrong recovery code', async ({
    page,
  }: IPage) => {
    await loginService.login(email, password);

    const twoFactor: Locator = locators.twoFactor(page);
    await expect(twoFactor).toBeVisible();
    await expect(page).toHaveURL(routes.twoFactor);

    await page.goto(routes.recoveryURL);
    await loginService.fillRecoveryCodeAndSend(recoveryCode);

    const recoveryFailedAlert: Locator = locators.recoveryFailedAlert(page);
    await expect(recoveryFailedAlert).toBeVisible();
    await expect(recoveryFailedAlert).toHaveCSS(
      mocks.css.borderColor,
      mocks.css.errorAlertBorderColor,
    );
    await expect(page).toHaveURL(routes.loginPage);
  });

  test('Should login and store cookies', async ({ page }: IPage) => {
    await page.goto(routes.loginPage);

    await expect(page).toHaveURL(routes.loginPage);
    await loginService.login(email, password);

    const twoFactor: Locator = locators.twoFactor(page);
    await expect(twoFactor).toBeVisible();
    await expect(page).toHaveURL(routes.sessionAfterLogin);

    await loginService.fillAndSendGoogle2faCode();
    expect(page.url()).toBe(routes.baseURL);

    const dashboard: Locator = locators.dashboard(page);

    await expect(dashboard).toBeVisible();
    const cookies: Cookie[] = await page.context().cookies();

    try {
      await mkDir(dirPaths.cookiesDir);
      await writeFile(dirPaths.cookiesFile, cookies);
    } catch (err) {
      logger.error(err);
    } finally {
      const cookies = await readFile(dirPaths.cookiesFile);
      const sessionCookie = cookies.find((cookie: Cookie) => {
        return cookie.name === mocks.sessionParams.loggedIn;
      });

      expect(sessionCookie?.value).toEqual(mocks.sessionParams.yes);
    };
  });
});
