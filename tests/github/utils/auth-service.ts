import { authenticator } from 'otplib';

export class AuthService {
  async createGoogle2FaCode(key: string) {
    const code: string = authenticator.generate(key);

    return code;
  }

}