import * as Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'nestjs-redis';
import UsersService from '../users/users.service';
import { IJwtPayload } from './interfaces/JwtPayload';
import { IRegistrationStatus } from './interfaces/IRegistrationStatus';
import { IAuthLoginInput } from './interfaces/IAuthLoginInput';
import UserDto from '../users/user.dto';
import Users from '../users/users.entity';
import 'dotenv/config';

@Injectable()
export default class AuthService {
  private readonly redisClient: Redis.Redis;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = redisService.getClient();
  }

  async register(user: UserDto) {
    let status: IRegistrationStatus = {
      success: true,
      message: 'user register',
    };
    try {
      await this.usersService.register(user);
    } catch (err) {
      status = { success: false, message: err };
    }
    return status;
  }

  async login(user: IAuthLoginInput): Promise<string> {
    const payload = {
      _id: user._id,
      email: user.email,
    };

    const accessToken: string = this.jwtService.sign(payload, {
      expiresIn: process.env.accessTokenExpirationTime,
    });
    const refreshToken: string = this.jwtService.sign(payload, {
      expiresIn: process.env.refreshTokenExpirationTime,
    });

    await this.redisClient.set(
      payload.email,
      refreshToken,
      'EX',
      86400,
    );

    return accessToken;
  }

  async validateUserToken(payload: IJwtPayload): Promise<Users> {
    return this.usersService.findByEmail(payload.email);
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await user.comparePassword(pass)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async passwordUpdate(email: string, oldPass: string, newPass:string): Promise<object> {
    const user = await this.usersService.findByEmail(email);
    if (user && await user.comparePassword(oldPass)) {
      return this.usersService.update(email, newPass);
    }
    return { msg: 'Incorrect password' };
  }

  getRefreshTokenByEmail(email: string): Promise<string> {
    return this.redisClient.get(email);
  }

  deleteTokenByEmail(email: string): Promise<number> {
    return this.redisClient.del(email);
  }

  deleteAllTokens(): Promise<string> {
    return this.redisClient.flushall();
  }
}
