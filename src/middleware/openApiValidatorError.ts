import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { error as eovErrors } from 'express-openapi-validator';
import { DomainErrror } from "../utils/error";

export function openAPIValidatorErrorMiddleware(): ErrorRequestHandler {
  return function (error: unknown, _req: Request, _res: Response, next: NextFunction): void {
    if (error instanceof eovErrors.BadRequest) {
      return next(DomainErrror.badRequest([error.message]));
    }
    if (error instanceof eovErrors.Unauthorized) {
      return next(DomainErrror.unauthorized());
    }
    if (error instanceof eovErrors.Forbidden) {
      return next(DomainErrror.forbidden());
    }
    if (error instanceof eovErrors.MethodNotAllowed) {
      return next(DomainErrror.unprocessableEntity([error.message]));
    }
    if (error instanceof eovErrors.NotFound) {
      return next(DomainErrror.notFound([error.message]));
    }
    if (error instanceof eovErrors.NotAcceptable) {
      return next(DomainErrror.unprocessableEntity([error.message]));
    }
    if (error instanceof eovErrors.MethodNotAllowed) {
      return next(DomainErrror.notFound([error.message]));
    }
    if (error instanceof eovErrors.RequestEntityTooLarge) {
      return next(DomainErrror.unprocessableEntity([error.message]));
    }
    if (error instanceof eovErrors.UnsupportedMediaType) {
      return next(DomainErrror.unprocessableEntity([error.message]));
    }
    if (error instanceof eovErrors.InternalServerError) {
      return next(DomainErrror.internalError([error.message]));
    }
    next(error);
  };
}
