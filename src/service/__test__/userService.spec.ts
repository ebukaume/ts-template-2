import { randomUUID } from 'crypto';
import { Mock } from 'ts-mockery';
import { UserServiceImpl } from '../userService';
import { type UserRepository } from '../../repository/userRepository';
import * as Fixture from '../../__fixtures__';

// getById(userId: string): Promise<User | undefined>;
// create(email: string): Promise<User>;

describe('UserServiceImpl', () => {
  const getByIdMock = jest.fn();
  const userRepositoryMock = Mock.of<UserRepository>({
    getById: getByIdMock
  });
  const userService = new UserServiceImpl(userRepositoryMock);

  it('returns a user if found', async () => {
    const userId = randomUUID();
    const user = Fixture.user({ id: userId });

    getByIdMock.mockResolvedValueOnce(user);

    const result = await userService.getUserById(userId);

    expect(result).toStrictEqual(user);
  });
});
