import { z } from 'zod';
import { generateSchema } from '@anatine/zod-openapi';

const userInput = z.object({
  username: z.string().nullable(),
  name: z.object({
    first: z.string(),
    last: z.string()
  }).optional(),
  email: z.string().email(),
  password: z.string(),
  passwordConfirmation: z.string()
}).strict();

export type UserRegisterationInput = z.infer<typeof userInput>;
export const userRegisterationInputSchema = generateSchema(userInput);
