import { z } from 'zod'
import { generateSchema } from '@anatine/zod-openapi'

const user = z.object({
  email: z.string().email()
})

const userSchema = generateSchema(user)

export { userSchema }
