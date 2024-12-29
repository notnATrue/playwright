import { selectors } from '../common/selectors';
import { locatorSelect } from '../helpers/locator-select';
import { Locator, Page } from '@playwright/test';
import { AuthService } from './auth-service';
import { config } from '../config/config';

export class LoginService {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page as Page;
  }

  async login(email: string, password: string): Promise<void> {
    const loginField: Locator = await locatorSelect(this.page, selectors.login);
    const passwordField: Locator = await locatorSelect(
      this.page,
      selectors.password,
    );
    const signInBtn: Locator = await locatorSelect(this.page, selectors.signIn);

    await loginField.fill(email);
    await passwordField.fill(password);
    await signInBtn.click();
  }

  async fillRecoveryCodeAndSend(recoveryCode: string): Promise<void> {
    const recoveryField: Locator = await locatorSelect(
      this.page,
      selectors.recoveryField,
    );
    const recoveryBtn: Locator = await locatorSelect(
      this.page,
      selectors.recoveryBtn,
    );

    await recoveryField.fill(recoveryCode);
    await recoveryBtn.click();
  }

  async fillAndSendGoogle2faCode(): Promise<void> {
    const authService = new AuthService();
    const code: string = await authService.createGoogle2FaCode(
      config.google2auth.key,
    );

    await this.page.keyboard.type(code, { delay: 250 });
    await this.page.waitForTimeout(2000);
  }
}
