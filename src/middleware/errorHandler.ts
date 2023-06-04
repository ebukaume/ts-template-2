import { type ErrorRequestHandler, type NextFunction, type Request, type Response } from 'express';
import { DomainErrror } from '../utils/error';

export function errorHandler (): ErrorRequestHandler {
  return (err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof DomainErrror) {
      res.status(err.statusCode).json({
        message: err.message,
        issues: err.issues
      });
    }

    next(err);
  };
}
