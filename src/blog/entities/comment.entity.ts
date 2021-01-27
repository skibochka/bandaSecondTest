import {
  Column, Entity, ObjectIdColumn, ObjectID,
} from 'typeorm';

@Entity('Comments')
export default class Comments {
  @ObjectIdColumn() _id: ObjectID;

  @ObjectIdColumn() postId: ObjectID;

  @ObjectIdColumn() userId: ObjectID;

  @Column() content: string;

  @Column() likes: string[];
}
