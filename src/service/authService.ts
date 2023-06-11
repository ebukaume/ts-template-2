import { type User } from '@prisma/client';
import { DomainErrror } from '../utils/error';
import { type UserRegisterationInput } from '../schema/request';
import { assertMatch, capitalize } from '../utils/string';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { BASE_URL, CONFIRMATION_EMAIL_EXPIRY, JWT_SECRET } from '../config';
import { type NotificationService } from './notificationService';
import { type Token, type UserOutput, type UserRegistrationOutput } from '../schema/response';
import { type UserService } from './userService';
import { type SessionService } from './sessionService';

export interface AuthService {
  register: (input: UserRegisterationInput) => Promise<UserRegistrationOutput>
  confirmEmail: (email: string, token: string) => Promise<UserOutput>
  login: (email: string, password: string) => Promise<Token>
  logout: (user: User | undefined) => Promise<void>
}

export class AuthServiceImpl implements AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor (
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly notificationService: NotificationService
  ) { }

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

    await this.userService.create({
      ...userPartial,
      password: hashedPassword,
      emailConfirmationToken: token,
      hasConfirmedEmail: false
    });

    const link = this.buildConfirmationLink(email, token);
    // TODO - re-enable after fixing email API issue
    // await this.notificationService.sendConfirmationEmail({
    //   name: fullname ?? email,
    //   email,
    //   link,
    // });

    return { ...userPartial, confirmationLink: link };
  }

  async confirmEmail (email: string, token: string): Promise<UserOutput> {
    const user = await this.userService.getByEmail(email);

    if (user.hasConfirmedEmail) {
      return user;
    }

    if (user.emailConfirmationToken !== token) {
      throw DomainErrror.badRequest(['wrong confirmation token']);
    }

    await this.userService.updateByEmail(email, { hasConfirmedEmail: true, emailConfirmationToken: '' });

    return this.serializeUser(user);
  }

  async login (email: string, password: string): Promise<Token> {
    const user = await this.userService.getByEmail(email);

    return await this.authenticate(user, password);
  }

  async logout (user: User | undefined): Promise<void> {
    if (user == null) {
      return;
    }

    await this.sessionService.delete(user.email);
  }

  async authenticate (user: User, password: string): Promise<Token> {
    if (!user.hasConfirmedEmail) {
      throw DomainErrror.badRequest(['Please verify your email before logging in']);
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw DomainErrror.badRequest(['Wrong email/password']);
    }

    return await this.sessionService.create(user.email);
  }

  private serializeUser (user: User): UserOutput {
    const { id, name, email, username } = user;

    return {
      id,
      name,
      email,
      username
    };
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

  private buildConfirmationLink (email: string, token: string): string {
    return `${BASE_URL}/v1/confirm-registration?email=${encodeURIComponent(email)}&token=${token}`;
  }
};
