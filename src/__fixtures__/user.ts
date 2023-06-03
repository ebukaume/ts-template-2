import { User } from "@prisma/client";
import { randomUUID } from "crypto";

export function user(params?: Partial<User>): User {
  return {
    id: randomUUID(),
    email: 'default@email.com',
    name: 'Some User',
    ...params
  }
}
