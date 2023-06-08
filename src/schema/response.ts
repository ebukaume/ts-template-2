import { z } from 'zod';
import { generateSchema } from '@anatine/zod-openapi';

const userRegistrationOutput = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  username: z.string().nullable()
});

export const userRegistrationResponseSchema = generateSchema(z.object({
  data: z.object({ user: userRegistrationOutput })
}));

export type UserRegistrationOutput = z.infer<typeof userRegistrationOutput>;
