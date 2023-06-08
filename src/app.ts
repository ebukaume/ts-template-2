import * as OpenApiValidator from 'express-openapi-validator';
import express, { json } from 'express';
import pino from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { injectDependencies } from './module/configureApp';
import { setupRoutes } from './module/setupRoutes';
import { errorHandler } from './middleware/errorHandler';
import { spec } from './schema/spec';
import { openAPIValidatorErrorMiddleware } from './middleware/openApiValidatorError';

const app = express();

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

injectDependencies(app);
setupRoutes(app);

app.use(openAPIValidatorErrorMiddleware());
app.use(errorHandler());

export { app };
