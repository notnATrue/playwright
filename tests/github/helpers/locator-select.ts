import { selectors } from "../common/selectors"

export const locatorSelect = async (page: any, locator: any) => {
    return page.locator(locator)
}