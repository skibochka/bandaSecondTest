import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import UsersService from '../users/users.service';
import { JwtPayload, RegistrationStatus } from './auth.interfaces';
import UserDto from '../users/user.dto';
import Users from '../users/users.entity';
import 'dotenv/config';

@Injectable()
export default class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(user: UserDto) {
    let status: RegistrationStatus = {
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

  createToken(user: Users) {
    return jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.KEY,
      { expiresIn: process.env.EXPIRES_IN },
    );
  }

  async validateUserToken(payload: JwtPayload): Promise<Users> {
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
    return null;
  }
}
