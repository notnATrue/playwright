import * as fs from 'node:fs';

export const readFile = async (filePath) => {
  const cookiesContent = await fs.promises.readFile(filePath, 'utf-8');
  const parsedCookiesContent = JSON.parse(cookiesContent);

  return parsedCookiesContent;
};

export const writeFile = async (filePath, cookies) => {
  fs.writeFile(filePath, JSON.stringify({ cookies }, null, 2), (err) => {
    console.log(err);
  });
};

export const mkDir = async (dir) => {
  fs.mkdir(dir, () => {});
};
