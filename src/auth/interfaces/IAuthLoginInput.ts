import { ObjectID } from 'typeorm';

export interface IAuthLoginInput {
  _id?: ObjectID;
  password?: string;
  email?: string;
}
