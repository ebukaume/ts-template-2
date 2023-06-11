import { type Application } from 'express';
import { type UserService, UserServiceImpl } from '../service/userService';
import { UserRepositoryImpl } from '../repository/userRepository';
import { PrismaClient } from '@prisma/client';
import { DomainErrror } from '../utils/error';
import { type AuthService, AuthServiceImpl } from '../service/authService';
import { NotificationServiceImpl } from '../service/notificationService';
import { MAILJET_API_KEY, MAILJET_API_SECRET } from '../config';
import Mailjet from 'node-mailjet';
import { type SessionService, SessionServiceImpl } from '../service/sessionService';
import { SessionRepositoryImpl } from '../repository/sessionRepository';

interface Service {
  user: UserService
  auth: AuthService
  session: SessionService
}

interface LocalDependency {
  service: Service
}

export function injectDependencies (app: Application): void {
  const userRepository = new UserRepositoryImpl(new PrismaClient());
  const sessionRepository = new SessionRepositoryImpl(new PrismaClient());
  const userService = new UserServiceImpl(userRepository);
  const sessionService = new SessionServiceImpl(sessionRepository, userService);
  const mailjet = new Mailjet({
    apiKey: MAILJET_API_KEY,
    apiSecret: MAILJET_API_SECRET
  });
  const notificationService = new NotificationServiceImpl(mailjet);
  const authService = new AuthServiceImpl(userService, sessionService, notificationService);

  const service: Service = {
    user: userService,
    auth: authService,
    session: sessionService
  };

  const deps: LocalDependency = { service };

  app.locals = deps;
}

export function getServices (app: Application): Service {
  if (app.locals.service === undefined) {
    throw DomainErrror.internalError(['Something went wrong', 'We are going to take a look 🙏']);
  }

  return app.locals.service;
}
