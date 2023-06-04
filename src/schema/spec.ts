import { type OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import { error, errorResponseSchema } from './error';
import { userResponseSchema } from './response';
import { userCreateSchema } from './request';

const v1Prefix = 'v1';

export const spec: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'Pawsmob',
    version: 'v1',
    description: 'Describe what this app does'
  },
  servers: [
    {
      url: 'http://localhost:3000'
    }
  ],
  paths: {
    [`/${v1Prefix}/user`]: {
      post: {
        tags: ['user'],
        summary: 'Create a user',
        description: 'Create a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#components/schemas/UserCreate'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Returns the created user',
            content: {
              'application/json': {
                schema: {
                  $ref: '#components/schemas/User'
                }
              }
            }
          },
          400: error('Bad Request'),
          401: error('Authentication required'),
          403: error('Forbidden!'),
          404: error('Not Found'),
          500: error('Internal Server Error')
        }
      }
    },
    [`/${v1Prefix}/user/{id}`]: {
      get: {
        tags: ['user'],
        summary: 'Find a user by id',
        description: 'Find a user by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Returns the user if found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          404: error('User not found')
        }
      }
    }
  },
  components: {
    securitySchemes: {
      Authorization: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    headers: {},
    schemas: {
      Error: errorResponseSchema,
      User: userResponseSchema,
      UserCreate: userCreateSchema
    }
  }
};
