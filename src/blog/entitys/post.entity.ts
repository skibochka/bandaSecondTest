import {
  Column, Entity, ObjectIdColumn, ObjectID,
} from 'typeorm';

@Entity('Posts')
export default class Posts {
  @ObjectIdColumn() _id: ObjectID;

  @Column() title: string;

  @Column() content: string;

  @Column() userId: string;

  @Column() likes: string[];

  @Column() createdAt: string;
}
