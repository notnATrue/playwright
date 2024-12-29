import { test, expect, Locator } from '@playwright/test';
import { coordinatesDispersion } from '../../helpers/coordinates-dispersion';
import { OperationService } from '../../services/operation-service';
import { IPage } from '../login/interface';
import { readFile } from '../../helpers/read-write';
import { locators } from '../../helpers/locators';
import { routes } from '../../common/routes';

test.describe.configure({ mode: 'serial' });

test.describe('Searching via Github', async () => {
  test.beforeEach(async ({ page }: IPage) => {
    const dir: string = './tests/github/test-json';
    const filePath: string = `${dir}/cookies.json`;

    const cookies = await readFile(filePath);

    await page.context().addCookies(cookies);
    await page.goto(routes.baseURL);

    expect(page.url()).toBe(routes.baseURL);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('Should search via github', async ({ page }: IPage) => {
    const mockText: string = 'typescript-eslint';
    const searchBtn: Locator = locators.searchBtn(page);

    const { width, height } = await coordinatesDispersion(searchBtn);
    const operationService = new OperationService();

    await operationService.clickOnSearchAndType(
      page,
      width,
      height,
      mockText,
    );

    const typescriptRepo: Locator = locators.typescriptRepo(page);
    await typescriptRepo.dblclick({ force: true, delay: 2000 });

    const link = locators.linkURL(page);

    expect(link).toBeDefined();
    await expect(page).toHaveURL(routes.typescriptURL);
  });

  test('Should search via copilot', async ({ page }: IPage) => {
    const mockText: string = 'jest';
    const copilotInput: Locator = locators.copilotInput(page);

    await copilotInput.click();
    await copilotInput.fill(mockText);
    await page.keyboard.press('Enter', { delay: 250 });

    await expect(page).toHaveURL(routes.copilotURL);
    await page.waitForTimeout(5000);
  });
});
