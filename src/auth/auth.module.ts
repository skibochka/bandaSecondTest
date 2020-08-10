import { Module } from '@nestjs/common';
import UsersModule from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import LocalStrategy from './strategys/local.strategy';
import JwtStrategy from './strategys/jwt.strategy';
import 'dotenv/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.KEY,
      signOptions: { expiresIn: process.env.EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, LocalStrategy, JwtStrategy],
})
export default class AuthModule {}
