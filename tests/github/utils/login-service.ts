import { selectors } from "../common/selectors"
import { locatorSelect } from "../helpers/locator-select"
import { Locator, Page } from '@playwright/test';

export class LoginService {
    private readonly page: Page

    constructor(page: Page) {
        this.page = page as Page
    }

    async login(email: string, password: string) {
        const loginField: Locator = await locatorSelect(this.page, selectors.login)
        const passwordField: Locator = await locatorSelect(this.page, selectors.password)
        const signInBtn: Locator = await locatorSelect(this.page, selectors.signIn)
    
        await loginField.fill(email);
        await passwordField.fill(password);
        await signInBtn.click();
    }

    async fillRecoveryCodeAndSend(recoveryCode: string) {
        const recoveryField: Locator = await locatorSelect(this.page, selectors.recoveryField)
        const recoveryBtn: Locator = await locatorSelect(this.page, selectors.recoveryBtn)

        await recoveryField.fill(recoveryCode)
        await recoveryBtn.click()
    }
}