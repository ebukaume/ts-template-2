import { type Session, type PrismaClient } from '@prisma/client';
import { type Token } from '../schema/response';

export interface SessionRepository {
  create: (email: string, token: Token) => Promise<Token>
  find: (where: Partial<Session>) => Promise<Session | undefined>
  delete: (email: string) => Promise<void>
  update: (field: Partial<Session>, accessToken: string) => Promise<void>
}

export class SessionRepositoryImpl implements SessionRepository {
  constructor (private readonly client: PrismaClient) { }

  async create (email: string, token: Token): Promise<Token> {
    return await this.client.session.upsert({
      where: { email },
      create: {
        email,
        ...token
      },
      update: {
        ...token
      }
    });
  }

  async find (where: Partial<Session>): Promise<Session | undefined> {
    const session = await this.client.session.findFirst({
      where
    });

    return session ?? undefined;
  }

  async delete (email: string): Promise<void> {
    await this.client.session.delete({
      where: {
        email
      }
    });
  }

  async update (where: Partial<Session>, accessToken: string): Promise<void> {
    await this.client.session.update({
      where,
      data: { accessToken }
    });
  }
};
