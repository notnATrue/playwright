import * as fs from 'node:fs'

export const readFile = async () => {
  const dir = './tests/github/test-json';
  const filePath = `${dir}/cookies.json`;

  const cookiesContent = await fs.promises.readFile(filePath, 'utf-8');
  const parsedCookiesContent = JSON.parse(cookiesContent)

  return parsedCookiesContent;
}

export const writeFile = async (cookies) => {
  const dir = './tests/github/test-json';
  const filePath = `${dir}/cookies.json`;

  fs.writeFile(filePath, JSON.stringify({ cookies }, null, 2), (err) => { console.log(err) });
}