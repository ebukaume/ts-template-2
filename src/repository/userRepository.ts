import { type PrismaClient, type User } from '@prisma/client';

export interface UserRepository {
  create: (registrationData: User) => Promise<User>
  getByEmail: (email: string) => Promise<User | undefined>
  getById: (userId: string) => Promise<User | undefined>
  updateById: (userId: string, data: Partial<User>) => Promise<User>
  updateByEmail: (email: string, data: Partial<User>) => Promise<User>
}

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly client: PrismaClient) { }

  async create (registrationData: User): Promise<User> {
    return await this.client.user.create({
      data: { ...registrationData }
    });
  }

  async getByEmail (email: string): Promise<User | undefined> {
    const user = await this.client.user.findFirst({
      where: {
        email
      }
    });

    return user ?? undefined;
  }

  async getById (userId: string): Promise<User | undefined> {
    const user = await this.client.user.findFirst({
      where: {
        id: userId
      }
    });

    return user ?? undefined;
  }

  async updateByEmail (email: string, data: Partial<User>): Promise<User> {
    return await this.client.user.update({
      where: {
        email
      },
      data
    });
  }

  async updateById (userId: string, data: Partial<User>): Promise<User> {
    return await this.client.user.update({
      where: {
        id: userId
      },
      data
    });
  }
};
