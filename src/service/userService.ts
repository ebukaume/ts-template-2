import { User } from "@prisma/client"
import { UserRepository } from "../repository/userRepository";
import { DomainErrror } from "../utils/error";

export interface UserService {
  getUserById(userId: string): Promise<User | undefined>;
  createUser(emails: string): Promise<User>;
}

export class UserServiceImpl implements UserService {
  constructor(private userRepository: UserRepository) { }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.getById(userId);

    if (user === undefined) {
      throw DomainErrror.notFound(['user does not exist']);
    }

    return user;
  }

  async createUser(email: string): Promise<User> {
    return this.userRepository.create(email);
  }
};
