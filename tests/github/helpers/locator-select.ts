import { selectors } from "../common/selectors"

export const locatorSelect = async (page: any, selector: any) => {
    return page.locator(selector)
}