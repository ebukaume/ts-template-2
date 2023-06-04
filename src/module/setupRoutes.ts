import { type Application } from 'express';
import { router as v1Router } from '../route/v1';
import { ResponseBuilder } from '../utils/responseBuilder';

export function setupRoutes (app: Application): void {
  app.use('/v1', v1Router);

  app.use('*', (_, res) => {
    ResponseBuilder.failure(res, 404, 'It seems you are lost 😉', ['Route does not exit']);
  });
}
