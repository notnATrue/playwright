import * as fs from 'node:fs'

const dir = './tests/github/test-json';
const filePath = `${dir}/cookies.json`;

export const readFile = async () => {
  const cookiesContent = await fs.promises.readFile(filePath, 'utf-8');
  const parsedCookiesContent = JSON.parse(cookiesContent)

  return parsedCookiesContent;
}

export const writeFile = async (cookies) => {
  fs.writeFile(filePath, JSON.stringify({ cookies }, null, 2), (err) => { console.log(err) });
}

export const mkDir = async (path) => {
  fs.mkdir(filePath, () => {});
}