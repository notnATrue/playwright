import { IBox } from '../e2e/login/interface';

export const coordinatesDispersion = async (searchBtn) => {
  const box: IBox = (await searchBtn.boundingBox()) as IBox;

  return { width: box.x + box.width / 2, height: box.y + box.height / 2 };
};
