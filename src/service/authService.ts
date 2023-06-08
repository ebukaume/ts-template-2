import { type User } from '@prisma/client';
import { type UserRepository } from '../repository/userRepository';
import { DomainErrror } from '../utils/error';
import { type UserRegisterationInput } from '../schema/request';
import { assertMatch, capitalize } from '../utils/string';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { CONFIRMATION_EMAIL_EXPIRY, JWT_SECRET } from '../config';
import { type NotificationService } from './notificationService';
import { type UserRegistrationOutput } from '../schema/response';

export interface AuthService {
  register: (input: UserRegisterationInput) => Promise<UserRegistrationOutput>
  confirmEmail: (userId: string) => Promise<User | undefined>
}

export class AuthServiceImpl implements AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor (private readonly userRepository: UserRepository, private readonly notificationService: NotificationService) { }

  async register (input: UserRegisterationInput): Promise<UserRegistrationOutput> {
    const { name, email, username, password, passwordConfirmation } = input;

    try {
      assertMatch(password, passwordConfirmation);
    } catch (error) {
      throw DomainErrror.badRequest(['"password" and "passwordConfirmation" must match']);
    }

    const id = randomUUID();
    const fullname = this.buildFullname(name);
    const hashedPassword = await this.hashPassword(password);
    const userPartial = {
      id,
      name: fullname,
      email,
      username
    };
    const token = this.getToken(userPartial);

    await this.userRepository.create({
      ...userPartial,
      password: hashedPassword,
      emailConfirmationToken: token
    });

    await this.notificationService.sendConfirmationEmail(email, token);

    return userPartial;
  }

  async confirmEmail (userId: string): Promise<User> {
    const user = await this.userRepository.getById(userId);

    if (user === undefined) {
      throw DomainErrror.notFound(['user does not exist']);
    }

    return user;
  }

  private buildFullname (name: UserRegisterationInput['name']): string | null {
    if (name === undefined) {
      return null;
    }

    return `${capitalize(name.first)} ${capitalize(name.last)}`;
  }

  private async hashPassword (plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, this.SALT_ROUNDS);
  }

  private getToken (user: Partial<User>): string {
    return jsonwebtoken.sign(user, JWT_SECRET, { expiresIn: CONFIRMATION_EMAIL_EXPIRY });
  }
};
