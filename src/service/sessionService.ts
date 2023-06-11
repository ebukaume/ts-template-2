import { type SessionRepository } from '../repository/sessionRepository';
import { type Token } from '../schema/response';
import { randomBytes } from 'crypto';
import jsonwebtoken, { TokenExpiredError } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { type Session, type User } from '@prisma/client';
import { type UserService } from './userService';
import { DomainErrror } from '../utils/error';

interface SessionData {
  user: User
  accessToken: string
}

export interface SessionService {
  create: (email: string) => Promise<Token>
  delete: (email: string) => Promise<void>
  update: (email: string, accessToken: string) => Promise<void>
  authenticateUser: (token: Token) => Promise<SessionData>
}

export class SessionServiceImpl implements SessionService {
  private readonly ACCESS_TOKEN_EXPIRY_IN_SECONDS = 300;

  constructor (
    private readonly sessionRepository: SessionRepository,
    private readonly userService: UserService
  ) { }

  async create (email: string): Promise<Token> {
    const token = {
      accessToken: this.getAccessToken(email),
      refreshToken: this.getRefreshToken()
    };

    try {
      await this.sessionRepository.create(email, token);
      return token;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete (email: string): Promise<void> {
    try {
      await this.sessionRepository.delete(email);
    } catch (error) {
      this.handleError(error);
    }
  }

  async update (email: string, accessToken: string): Promise<void> {
    try {
      await this.sessionRepository.update({ email }, accessToken);
    } catch (error) {
      this.handleError(error);
    }
  }

  async authenticateUser (token: Token): Promise<SessionData> {
    const { accessToken, refreshToken } = token;

    try {
      const { email } = await this.getSession(accessToken, false);

      const user = await this.userService.getByEmail(email);
      return { user, accessToken };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        const { email } = await this.getSession(accessToken, true);
        return await this.refreshToken(email, refreshToken);
      }

      throw (error);
    }
  }

  private async getSession (token: string, ignoreExpiration: boolean): Promise<Session> {
    const { email } = jsonwebtoken.verify(token, JWT_SECRET, { ignoreExpiration }) as Record<string, string>;

    const session = await this.sessionRepository.find({ email });

    if (session === undefined) {
      throw DomainErrror.unauthorized();
    }

    return session;
  }

  private async refreshToken (email: string, refreshToken: string): Promise<SessionData> {
    const accessToken = this.getAccessToken(email);

    try {
      const session = await this.sessionRepository.find({ refreshToken });

      if (session === undefined) {
        throw DomainErrror.unauthorized();
      }

      await this.sessionRepository.update({ refreshToken }, accessToken);
      const user = await this.userService.getByEmail(email);

      return { user, accessToken };
    } catch (error) {
      this.handleError(error);
    }
  }

  private getAccessToken (email: string): string {
    return jsonwebtoken.sign({ email }, JWT_SECRET, { expiresIn: this.ACCESS_TOKEN_EXPIRY_IN_SECONDS });
  }

  private getRefreshToken (): string {
    return randomBytes(32).toString('base64');
  }

  private handleError (error: unknown): never {
    if (error instanceof DomainErrror) {
      throw error;
    }

    throw DomainErrror.internalError([(error as Error).name]);
  }
};
