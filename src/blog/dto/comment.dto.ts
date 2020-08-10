import {
  IsString, IsNotEmpty, MinLength, MaxLength, IsObject,
} from 'class-validator';

export default class commentDto {
  @IsString()
  _id: string;

  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, {
    message: 'Title is too short',
  })
  @MaxLength(50, {
    message: 'Title is too long',
  })
  readonly content: string;

  @IsObject()
  likes: string[];
}
