import { type NextFunction, type ErrorRequestHandler, type Request, type Response } from 'express';
import { DomainErrror } from '../utils/error';
import { ResponseBuilder } from '../utils/responseBuilder';

export function errorHandler (): ErrorRequestHandler {
  return (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.log({ err });
    if (err instanceof DomainErrror) {
      console.log({ err, where: 'instanceof' });
      ResponseBuilder.failure(res, err.statusCode, err.message, err.issues); return;
    }

    console.log({ err, where: ' notinstanceof' });
    ResponseBuilder.failure(res, 500, 'Something went wrong', [(err).message]);
  };
}
