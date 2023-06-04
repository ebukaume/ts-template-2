import { generateSchema } from '@anatine/zod-openapi';
import { type OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import { z } from 'zod';

export function error (description: string): OpenAPIV3.ResponseObject {
  return {
    description,
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Error'
        }
      }
    }
  } as const;
}

const errorResponse = z.object({
  message: z.string(),
  issues: z.array(z.string())
});

export const errorResponseSchema = generateSchema(errorResponse);
