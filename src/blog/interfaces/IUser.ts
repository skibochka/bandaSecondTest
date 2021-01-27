import { ObjectID } from 'typeorm';

export interface IUser {
  _id: ObjectID;

  email: string;
}
