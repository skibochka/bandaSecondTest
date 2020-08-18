import { ObjectID } from 'typeorm';

export interface IComment {
  _id: ObjectID;

  postId: string;

  userId: string;

  content: string;

  likes: string[];
}
