import { type PrismaClient, type User } from '@prisma/client';

export interface UserRepository {
  create: (registrationData: User) => Promise<User>
  getById: (userId: string) => Promise<User | undefined>
}

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly client: PrismaClient) { }

  async create (registrationData: User): Promise<User> {
    return await this.client.user.create({
      data: { ...registrationData }
    });
  }

  async getById (userId: string): Promise<User | undefined> {
    const user = await this.client.user.findFirst({
      where: {
        id: userId
      }
    });

    return user ?? undefined;
  }
};
