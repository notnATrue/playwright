import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config = {
  email: process.env.EMAIL || '',
  password: process.env.PASSWORD || '',
  recoveryCode: process.env.RECOVERY_CODE || '',
};
