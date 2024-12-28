import { selectors } from "../common/selectors"
import { locatorSelect } from "../helpers/locator-select"

export class LoginService {
    private readonly page: any
    
    constructor(page: any) {
        this.page = page
    }

    async login(email: string, password: string) {
        const loginField = await locatorSelect(this.page, selectors.login)
        const passwordField = await locatorSelect(this.page, selectors.password)
        const signInBtn = await locatorSelect(this.page, selectors.signIn)
    
        await loginField.fill(email);
        await passwordField.fill(password);
        await signInBtn.click();
    }

    async fillRecoveryCodeAndSend(recoveryCode: string) {
        const recoveryField = await locatorSelect(this.page, selectors.recoveryField)
        await recoveryField.fill(recoveryCode)
        const recoveryBtn = await locatorSelect(this.page, selectors.recoveryBtn)
        await recoveryBtn.click()
    }
}