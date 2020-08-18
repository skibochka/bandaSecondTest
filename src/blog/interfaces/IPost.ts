import { ObjectID } from 'typeorm';

export interface IPost {
  _id: ObjectID;

   title: string;

   content: string;

   userId: string;

   likes: string[];

   createdAt: string;
}
