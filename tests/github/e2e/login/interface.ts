import { Page } from '@playwright/test';

export interface IPage {
  page: Page;
}

export interface IUserEmailAndPassword {
  email: string;
  password: string;
}