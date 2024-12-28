import dotenv from 'dotenv';

dotenv.config();

export const config = {
    email: process.env.EMAIL,
    password: process.env.PASSWORD
}