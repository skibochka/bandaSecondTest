import {
  IsString, IsObject, IsNotEmpty, MinLength, MaxLength,
} from 'class-validator';

export default class postDto {
  @IsString()
  readonly _id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'Title is too short',
  })
  @MaxLength(15, {
    message: 'Title is too long',
  })
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsObject()
  public likes: string[] | [];

  @IsString()
  @IsNotEmpty()
  public createdAt: string;
}
