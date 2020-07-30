import { IsString, IsObject, IsNotEmpty, MinLength, MaxLength} from 'class-validator';

export class postDto {
  @IsString()
  _id: string;

  @IsString()
  @IsNotEmpty()
  readonly article_id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: "Title is too short"
  })
  @MaxLength(15, {
    message: "Title is too long"
  })
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsString()
  likes: string;

  @IsObject()
  comments: object;

  @IsString()
  @IsNotEmpty()
  createdAt: string;
}
