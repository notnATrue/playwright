import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config = {
  user: {
    email: process.env.EMAIL || '',
    password: process.env.PASSWORD || '',
    recoveryCode: process.env.RECOVERY_CODE || '',
  },
  github: {
    ci: process.env.CI,
  },
  google2auth: {
    key: process.env.GOOGLE_2_FA_PRIVATE_KEY || '',
  },
};
