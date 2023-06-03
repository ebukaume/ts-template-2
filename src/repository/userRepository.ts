import { PrismaClient, User } from '@prisma/client'

export interface UserRepository {
  getById(userId: string): Promise<User | undefined>;
  create(email: string): Promise<User>;
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private client: PrismaClient) { }

  async getById(userId: string): Promise<User | undefined> {
    const user = await this.client.user.findFirst({
      where: {
        id: userId
      }
    })

    return user ?? undefined;
  }

  async create(email: string): Promise<User> {
    return this.client.user.create({
      data: { email }
    });
  }
};
