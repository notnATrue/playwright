import { Page, BrowserContext } from '@playwright/test';

export interface IPage {
  page: Page;
}

export interface IUserEmailAndPassword {
  email: string;
  password: string;
  recoveryCode: string;
}

export interface IBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
