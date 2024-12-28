import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config = {
  user: {
    email: process.env.EMAIL || '',
    password: process.env.PASSWORD || '',
    recoveryCode: process.env.RECOVERY_CODE || '',
  },
  github: {
    ci: process.env.CI
  }

};
