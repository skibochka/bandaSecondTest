import {
  IsString, IsNotEmpty, MinLength, MaxLength, IsObject,
} from 'class-validator';
import { ObjectID } from 'typeorm';

export default class commentDto {
  @IsString()
  readonly _id: ObjectID;

  @IsNotEmpty()
  @IsString()
  public postId: ObjectID;

  @IsString()
  @IsNotEmpty()
  public userId: ObjectID;

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
  public likes: string[] | [];
}
