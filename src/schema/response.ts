import { z } from 'zod';
import { generateSchema } from '@anatine/zod-openapi';

export const userOutput = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  username: z.string().nullable()
});

const userRegistrationOutput = z.intersection(userOutput, z.object({
  confirmationLink: z.string() // TODO - remove after fixing email sending
}));

const token = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});

export const userRegistrationResponseSchema = generateSchema(z.object({
  data: z.object({ user: userRegistrationOutput })
}));

export const emailConfirmationResponseSchema = generateSchema(z.object({
  data: z.object({ user: userOutput })
}));

export const loginResponseSchema = generateSchema(z.object({
  data: z.object({ token })
}));

export type UserRegistrationOutput = z.infer<typeof userRegistrationOutput>;
export type UserOutput = z.infer<typeof userOutput>;
export type Token = z.infer<typeof token>;
