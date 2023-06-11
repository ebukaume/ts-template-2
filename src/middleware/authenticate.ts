import { type NextFunction, type Response } from 'express';
import { DomainErrror } from '../utils/error';
import { ResponseBuilder } from '../utils/responseBuilder';
import { type AuthenticatedRequest } from '../type';
import { getServices } from '../module/configureApp';

export function authenticate () {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { session: sessionService } = getServices(req.app);
    const { accesstoken: accessToken, refreshtoken: refreshToken } = req.headers as Record<string, string>;

    if (accessToken === undefined || refreshToken === undefined) {
      throw DomainErrror.unauthorized();
    }

    try {
      const { user, accessToken: newAccessToken } = await sessionService.authenticateUser({ accessToken, refreshToken });

      req.user = user;
      res.setHeader('accessToken', newAccessToken);
      res.setHeader('refreshToken', refreshToken);
    } catch (error) {
      if (error instanceof DomainErrror) {
        ResponseBuilder.failure(res, error.statusCode, error.message, error.issues); return;
      }

      ResponseBuilder.failure(res, 500, 'Something went wrong', [(error as Error).message]);
    }

    next();
  };
}
