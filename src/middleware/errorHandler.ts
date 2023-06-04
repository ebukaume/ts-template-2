import { type ErrorRequestHandler, type NextFunction, type Request, type Response } from 'express';
import { DomainErrror } from '../utils/error';
import { ResponseBuilder } from '../utils/responseBuilder';

export function errorHandler (): ErrorRequestHandler {
  return (err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof DomainErrror) {
      ResponseBuilder.failure(res, err.statusCode, err.message, err.issues);
    }

    next(err);
  };
}
