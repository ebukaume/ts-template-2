import * as OpenApiValidator from 'express-openapi-validator';
import express, { type Application, json, urlencoded } from 'express';
import pino from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { setupRoutes } from './module/setupRoutes';
import { errorHandler } from './middleware/errorHandler';
import { spec } from './schema/spec';
import { openAPIValidatorErrorMiddleware } from './middleware/openApiValidatorError';
import { type Config, Dependency, type Driver } from './module/dependency';

export function createApp (drivers: Driver, config: Config): Application {
  Dependency.build(drivers, config);

  const app = express();

  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(pino());

  app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(spec));

  app.use(
    OpenApiValidator.middleware({
      apiSpec: spec,
      validateRequests: true
      // validateResponses: true
    })
  );

  setupRoutes(app);

  app.use(openAPIValidatorErrorMiddleware());
  app.use(errorHandler());

  return app;
}
