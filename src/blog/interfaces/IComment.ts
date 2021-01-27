import { ObjectID } from 'typeorm';

export interface IComment {
  _id: ObjectID;

  postId: ObjectID;

  userId: ObjectID;

  content: string;

  likes: string[];
}
