import { Application, Request } from "express";
import { UserService, UserServiceImpl } from "../service/userService";
import { UserRepositoryImpl } from "../repository/userRepository";
import { PrismaClient } from "@prisma/client";
import { DomainErrror } from "../utils/error";

interface Service {
  user: UserService
}

interface LocalDependency {
  service: Service;
}

export function injectDependencies(app: Application) {
  const userRepository = new UserRepositoryImpl(new PrismaClient())
  const userService = new UserServiceImpl(userRepository);


  const service: Service = {
    user: userService
  }

  const deps: LocalDependency = { service }

  app.locals = deps;
}

export function getServices(app: Application): Service {
  if (!app.locals.service) {
    throw DomainErrror.internalError(['Something went wrong', 'We are going to take a look 🙏'])
  }

  return app.locals.service;
}