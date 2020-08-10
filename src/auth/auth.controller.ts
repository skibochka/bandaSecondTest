import {
  Controller, UseGuards, HttpStatus, Response, Post, Body, Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import AuthService from './auth.service';
import UsersService from '../users/users.service';
import UserDto from '../users/user.dto';
import LoginDto from './login.dto';
import { IUpdate } from './auth.interfaces';
import 'dotenv/config';

@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  public async register(@Response() res, @Body() Profile: UserDto) {
    const result = await this.authService.register(Profile);
    if (!result.success) {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
    return res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public async login(@Response() res, @Body() login: LoginDto) {
    const user = await this.usersService.findByEmail(login.email);
    if (!user) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'User Not Found',
      });
    }
    const token = this.authService.createToken(user);
    res.setHeader('Authorization', `Bearer ${token}`);
    return res.status(HttpStatus.OK).json(token);
  }

  @Post('/update')
  public async passwordUpdate(@Request() req, @Response() res, @Body() profile: IUpdate) {
    const token = req.headers.authorization.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.KEY);
    bcrypt.hash(profile.newPassword, 10, async (err, hash) => {
      const updatedPass = await this.authService.passwordUpdate(decoded.email, profile.oldPassword, hash);
      return res.status(HttpStatus.OK).json(updatedPass);
    });
    return 'Something wrong';
  }
}
