import {
  Controller, UseGuards, HttpStatus, Response, Post, Body, Request,
  Delete, HttpCode, Param, UnauthorizedException, NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import AuthService from './auth.service';
import UsersService from '../users/users.service';
import UserDto from '../users/user.dto';
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
    const token = await this.authService.login(user);
    console.log(token);
    return res.status(HttpStatus.OK).json(token);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  public async passwordUpdate(@Request() req, @Response() res, @Body() profile: IUpdate) {
    if (profile.newPassword === profile.newPasswordAgain) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded: any = this.jwtService.verify(token);
      bcrypt.hash(profile.newPassword, 10, async (err, hash) => {
        const result = await this.authService.passwordUpdate(decoded.email, profile.oldPassword, hash);
        return res.status(HttpStatus.OK).json(result);
      });
    }
    return 'Passwords don`t match';
  }

  @Post('refreshToken')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Response() res) {
    const verifiedUser = this.jwtService.verify(refreshTokenDto.refreshToken);
    const oldRefreshToken: string = await this.authService.getRefreshTokenByEmail(verifiedUser.email);

    // if the old refresh token is not equal to request refresh token then this user is unauthorized
    if (!oldRefreshToken || oldRefreshToken !== refreshTokenDto.refreshToken) {
      throw new UnauthorizedException('Authentication credentials were missing or incorrect');
    }

    const payload = {
      id: verifiedUser.id,
      email: verifiedUser.email,
    };

    const newTokens = await this.authService.login(payload);
    return res.status(HttpStatus.OK).json(newTokens);
  }

  @Delete('logout/:token')
  @HttpCode(204)
  async logout(@Param('token') token: string): Promise<boolean | never> {
    const { email } = this.jwtService.verify(token);

    const deletedUserCount = await this.authService.deleteTokenByEmail(email);

    if (deletedUserCount === 0) {
      throw new NotFoundException('The item does not exist');
    }

    return true;
  }

  @Delete('logoutAll')
  @HttpCode(204)
  async logoutAll(): Promise<boolean> {
    await this.authService.deleteAllTokens();

    return true;
  }
}
