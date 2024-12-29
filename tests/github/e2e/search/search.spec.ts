import { test, expect, Locator } from '@playwright/test';
import { selectors } from '../../common/selectors';
import { coordinatesDispersion } from '../../helpers/coordinates-dispersion';
import { locatorSelect } from '../../helpers/locator-select';
import { OperationService } from '../../utils/operation-service';
import { IPage } from '../login/interface';
import { readFile } from '../../helpers/read-write';

test.describe.configure({ mode: 'serial' });

test.describe('Searching via Github', async () => {
  test.beforeEach(async ({ page }: IPage) => {
    const baseURL: string = 'https://github.com/';
    const dir: string = './tests/github/test-json';
    const filePath: string = `${dir}/cookies.json`;

    const { cookies } = await readFile(filePath);

    await page.context().addCookies(cookies);
    await page.goto(baseURL);

    expect(page.url()).toBe(baseURL);
  });

  test('Should search via github', async ({ page }: IPage) => {
    const mockText: string = 'typescript-eslint';
    const mockURL: string = '/typescript-eslint/typescript-eslint';
    const searchBtn: Locator = page.getByRole('button', {
      name: 'Type / to search',
    });

    const { width, height } = await coordinatesDispersion(searchBtn);
    const operationService = new OperationService();

    (await operationService.clickOnSearchAndType(
      page,
      width,
      height,
      mockText,
    )) as void;

    const typescriptRepo: Locator = await locatorSelect(
      page,
      selectors.typescriptRepo,
    );
    await typescriptRepo.dblclick({ force: true, delay: 2000 });

    const link = await locatorSelect(page, selectors.typescriptURL);

    expect(link).toBeDefined();
    await expect(page).toHaveURL(mockURL);
  });

  test('Should search via copilot', async ({ page }: IPage) => {
    const copilotInput: Locator = page.locator(selectors.copilotInput);
    const mockText: string = 'jest';
    const copilotURL: string = '/copilot';

    await copilotInput.click();
    await copilotInput.fill(mockText);
    await page.keyboard.press('Enter', { delay: 250 });

    await expect(page).toHaveURL(copilotURL);
    await page.waitForTimeout(5000);
  });
});
