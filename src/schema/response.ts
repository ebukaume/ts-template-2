import { z } from 'zod'
import { generateSchema } from '@anatine/zod-openapi'

const user = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullish()
})

const userResponseSchema = generateSchema(z.object({
  data: z.object({ user })
}))

export { userResponseSchema }
