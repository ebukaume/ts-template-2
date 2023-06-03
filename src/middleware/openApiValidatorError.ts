import { type ErrorRequestHandler, type NextFunction, type Request, type Response } from 'express'
import { error as eovErrors } from 'express-openapi-validator'
import { DomainErrror } from '../utils/error'

export function openAPIValidatorErrorMiddleware (): ErrorRequestHandler {
  return function (error: unknown, _req: Request, _res: Response, next: NextFunction): void {
    if (error instanceof eovErrors.BadRequest) {
      next(DomainErrror.badRequest([error.message])); return
    }
    if (error instanceof eovErrors.Unauthorized) {
      next(DomainErrror.unauthorized()); return
    }
    if (error instanceof eovErrors.Forbidden) {
      next(DomainErrror.forbidden()); return
    }
    if (error instanceof eovErrors.MethodNotAllowed) {
      next(DomainErrror.unprocessableEntity([error.message])); return
    }
    if (error instanceof eovErrors.NotFound) {
      next(DomainErrror.notFound([error.message])); return
    }
    if (error instanceof eovErrors.NotAcceptable) {
      next(DomainErrror.unprocessableEntity([error.message])); return
    }
    if (error instanceof eovErrors.MethodNotAllowed) {
      next(DomainErrror.notFound([error.message])); return
    }
    if (error instanceof eovErrors.RequestEntityTooLarge) {
      next(DomainErrror.unprocessableEntity([error.message])); return
    }
    if (error instanceof eovErrors.UnsupportedMediaType) {
      next(DomainErrror.unprocessableEntity([error.message])); return
    }
    if (error instanceof eovErrors.InternalServerError) {
      next(DomainErrror.internalError([error.message])); return
    }
    next(error)
  }
}
