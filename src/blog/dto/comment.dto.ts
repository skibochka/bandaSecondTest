import { IsString, IsNotEmpty, MinLength, MaxLength} from 'class-validator';
import { ObjectID } from 'typeorm';

export class commentDto {
  @IsString()
  _id: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, {
    message: "Title is too short"
  })
  @MaxLength(50, {
    message: "Title is too long"
  })
  readonly content: string;

  @IsString()
  likes: string
}
