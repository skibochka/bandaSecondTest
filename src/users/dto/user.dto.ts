import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export default class UserDto {
  @IsString()
  readonly _id: string;

  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
