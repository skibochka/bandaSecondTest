import {
  Controller,
  UseGuards,
  HttpStatus,
  Response,
  Post,
  Body,
  Request,
  Delete,
  HttpCode,
  Param,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import AuthService from './auth.service';
import UsersService from '../users/users.service';
import UserDto from '../users/dto/user.dto';
import LoginDto from './dto/login.dto';
import RefreshTokenDto from './dto/refreshToken.dto';
import { IUpdate } from './interfaces/IUpdate';

@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
  }

  @Post('sign-up')
  public async register(@Response() res, @Body() Profile: UserDto) {
    const result = await this.authService.register(Profile);
    if (!result.success) {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
    return res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  public async login(@Response() res, @Body() login: LoginDto) {
    const user = await this.usersService.findByEmail(login.email);
    if (!user) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'User Not Found',
      });
    }
    const token = await this.authService.login(user);
    return res.status(HttpStatus.OK).json(token);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  public async passwordUpdate(@Request() req, @Response() res, @Body() profile: IUpdate) {
    if (profile.newPassword !== profile.newPasswordAgain) {
      return 'Passwords don`t match';
    }

    const [, token] = req.headers.authorization.split(' ');
    const decoded: any = this.jwtService.verify(token);
    bcrypt.hash(profile.newPassword, 10, async (err, hash) => {
      const result = await this.authService.passwordUpdate(decoded.email, profile.oldPassword, hash);
      return res.status(HttpStatus.OK).json(result);
    });
  }

  @Post('refreshToken')
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto, @Response() res) {
    const { id: _id, email } = this.jwtService.verify(refreshToken);
    const oldRefreshToken: string = await this.authService.getRefreshTokenByEmail(email);

    /** if the old refresh token is not equal to request refresh token then this user is unauthorized*/
    if (!oldRefreshToken || oldRefreshToken !== refreshToken) {
      throw new UnauthorizedException('Authentication credentials were missing or incorrect');
    }


    const newTokens = await this.authService.login({ _id, email });
    return res.status(HttpStatus.OK).json(newTokens);
  }

  @Delete('logout/all')
  @HttpCode(204)
  async logoutAll(): Promise<boolean> {
    await this.authService.deleteAllTokens();
    return true;
  }

  @Delete('logout/:token')
  @HttpCode(204)
  async logout(@Param('token') token: string): Promise<boolean | never> {
    const { email } = this.jwtService.verify(token);

    const deletedUserCount = await this.authService.deleteTokenByEmail(email);
    if (!deletedUserCount) {
      throw new NotFoundException('The item does not exist');
    }
    return true;
  }
}
