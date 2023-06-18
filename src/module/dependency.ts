import { type PrismaClient } from '@prisma/client';
import type Mailjet from 'node-mailjet';
import { type AuthService, AuthServiceImpl } from '../service/authService';
import { type SessionService, SessionServiceImpl } from '../service/sessionService';
import { type UserService, UserServiceImpl } from '../service/userService';
import { SessionRepositoryImpl } from '../repository/sessionRepository';
import { UserRepositoryImpl } from '../repository/userRepository';
import { NotificationServiceImpl } from '../service/notificationService';
import { DomainErrror } from '../utils/error';

interface Service {
  user: UserService
  auth: AuthService
  session: SessionService
}

export interface Driver {
  PrismaClient: typeof PrismaClient
  MailjetClient: typeof Mailjet
}

export interface Config {
  mailjetApiKey: string
  mailjetApiSecret: string
}

export class Dependency {
  private static instance: Dependency | undefined;

  private constructor (
    public readonly service: Service
  ) { }

  static build (driver: Driver, config: Config): Dependency {
    if (this.instance === undefined) {
      const { PrismaClient, MailjetClient } = driver;
      const { mailjetApiKey, mailjetApiSecret } = config;

      const userRepository = new UserRepositoryImpl(new PrismaClient());
      const sessionRepository = new SessionRepositoryImpl(new PrismaClient());
      const userService = new UserServiceImpl(userRepository);
      const sessionService = new SessionServiceImpl(sessionRepository, userService);
      const mailjet = new MailjetClient({
        apiKey: mailjetApiKey,
        apiSecret: mailjetApiSecret
      });
      const notificationService = new NotificationServiceImpl(mailjet);
      const authService = new AuthServiceImpl(userService, sessionService, notificationService);

      const service: Service = {
        user: userService,
        auth: authService,
        session: sessionService
      };

      this.instance = new this(service);
    }

    return this.instance;
  }

  static get service (): Service {
    if (this.instance === undefined) {
      throw DomainErrror.internalError(['Something went wrong', 'We are going to take a look 🙏']);
    }

    return this.instance.service;
  }
}
