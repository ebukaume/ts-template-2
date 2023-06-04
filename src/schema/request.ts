import { z } from 'zod';
import { generateSchema } from '@anatine/zod-openapi';

const user = z.object({
  email: z.string().email(),
  name: z.string().optional()
});

const userCreateSchema = generateSchema(user);

export { userCreateSchema };
