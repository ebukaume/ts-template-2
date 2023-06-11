import { type User } from '@prisma/client';
import { type UserRepository } from '../repository/userRepository';
import { DomainErrror } from '../utils/error';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export interface UserService {
  create: (registrationData: User) => Promise<User>
  getByEmail: (email: string) => Promise<User>
  getById: (userId: string) => Promise<User>
  updateById: (userId: string, data: Partial<User>) => Promise<User>
  updateByEmail: (email: string, data: Partial<User>) => Promise<User>
}

export class UserServiceImpl implements UserService {
  constructor (private readonly userRepository: UserRepository) { }

  async create (registrationData: User): Promise<User> {
    try {
      return await this.userRepository.create(registrationData);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getByEmail (email: string): Promise<User> {
    const user = await this.userRepository.getByEmail(email);

    return this.assertUserExist(user);
  }

  async getById (userId: string): Promise<User> {
    const user = await this.userRepository.getById(userId);

    return this.assertUserExist(user);
  }

  async updateByEmail (email: string, data: Partial<User>): Promise<User> {
    return await this.userRepository.updateByEmail(email, data);
  }

  async updateById (userId: string, data: Partial<User>): Promise<User> {
    return await this.userRepository.updateById(userId, data);
  }

  private assertUserExist (user: User | undefined): User {
    if (user === undefined) {
      throw DomainErrror.notFound(['user does not exist']);
    }

    return user;
  }

  private handleError (error: unknown): never {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw DomainErrror.unprocessableEntity(['User with email already exist']);
        default:
          throw DomainErrror.internalError([error.code, error.message]);
      }
    }

    throw error;
  }
};
