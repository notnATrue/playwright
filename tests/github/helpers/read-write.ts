import { Cookie } from '@playwright/test';
import * as fs from 'node:fs';

export const readFile = async (filePath: string) => {
  const cookiesContent = await fs.promises.readFile(filePath, 'utf-8');
  const parsedCookiesContent = JSON.parse(cookiesContent) as {
    cookies: Cookie[];
  };

  return parsedCookiesContent;
};

export const writeFile = async (filePath: string, cookies: Cookie[]) => {
  await fs.promises.writeFile(filePath, JSON.stringify({ cookies }, null, 2));
};

export const mkDir = async (dir: string) => {
  fs.mkdir(dir, () => {});
};
