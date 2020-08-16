import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export default class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
