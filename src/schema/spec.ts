import { type OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import { error, errorResponseSchema } from './error';
import { emailConfirmationResponseSchema, loginResponseSchema, userRegistrationResponseSchema } from './response';
import { userRegisterationInputSchema } from './request';

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
    [`/${v1Prefix}/register`]: {
      post: {
        tags: ['auth'],
        summary: 'Registers an account for a user',
        description: 'Registers an account for a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: {
                    type: 'string'
                  },
                  name: {
                    type: 'object',
                    properties: {
                      first: {
                        type: 'string'
                      },
                      last: {
                        type: 'string'
                      }
                    }
                  },
                  email: {
                    type: 'string'
                  },
                  password: {
                    type: 'string'
                  },
                  passwordConfirmation: {
                    type: 'string'
                  }
                },
                required: ['username', 'email', 'password', 'passwordConfirmation'],
                additionalProperties: false
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Returns the id of the user',
            content: {
              'application/json': {
                schema: {
                  $ref: '#components/schemas/UserRegistrationOutput'
                }
              }
            }
          },
          400: error('Bad Request'),
          500: error('Internal Server Error'),
          '4XX': error('Your problem')
        }
      }
    },
    [`/${v1Prefix}/confirm-registration`]: {
      get: {
        tags: ['auth'],
        summary: 'Complete user registeration flow by confirming the provided email address',
        description: 'Complete user registeration flow by confirming the provided email address',
        parameters: [
          {
            name: 'email',
            in: 'query',
            required: true,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'token',
            in: 'query',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'Confirmation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/EmailConfirmationOutput'
                }
              }
            }
          },
          400: error('Bad Request'),
          404: error('User not found'),
          422: error('Unprocessible entity'),
          500: error('Internal server error')
        }
      }
    },
    [`/${v1Prefix}/login`]: {
      post: {
        tags: ['auth'],
        summary: 'Logs in in a user',
        description: 'Login using email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string'
                  },
                  password: {
                    type: 'string'
                  }
                },
                required: ['email', 'password'],
                additionalProperties: false
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Returns access and refresh token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#components/schemas/UserRegistrationOutput'
                }
              }
            }
          },
          400: error('Bad Request'),
          500: error('Internal Server Error')
        }
      }
    },
    [`/${v1Prefix}/logout`]: {
      delete: {
        tags: ['auth'],
        summary: 'Logs out in a user',
        description: 'Log out',
        parameters: [
          {
            name: 'accessToken',
            in: 'header',
            required: true,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'refreshToken',
            in: 'header',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          200: {
            description: 'User has been logged out',
            content: {
              'application/json': {
                schema: {
                  type: 'object'
                }
              }
            }
          },
          400: error('Bad Request'),
          500: error('Internal Server Error')
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
      UserRegisterationInput: userRegisterationInputSchema,
      UserRegistrationOutput: userRegistrationResponseSchema,
      EmailConfirmationOutput: emailConfirmationResponseSchema,
      LoginOutput: loginResponseSchema
    }
  }
};
