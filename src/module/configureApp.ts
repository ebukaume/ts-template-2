import { type Application } from 'express';
import { type UserService, UserServiceImpl } from '../service/userService';
import { UserRepositoryImpl } from '../repository/userRepository';
import { PrismaClient } from '@prisma/client';
import { DomainErrror } from '../utils/error';
import { type AuthService, AuthServiceImpl } from '../service/authService';
import { NotificationServiceImpl } from '../service/notificationService';
import sendgrid from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '../config';

interface Service {
  user: UserService
  auth: AuthService
}

interface LocalDependency {
  service: Service
}

export function injectDependencies (app: Application): void {
  const userRepository = new UserRepositoryImpl(new PrismaClient());
  const userService = new UserServiceImpl(userRepository);
  sendgrid.setApiKey(SENDGRID_API_KEY);
  const notificationService = new NotificationServiceImpl(sendgrid);
  const authService = new AuthServiceImpl(userRepository, notificationService);

  const service: Service = {
    user: userService,
    auth: authService
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
