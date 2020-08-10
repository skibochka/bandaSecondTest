import {
  Column, Entity, ObjectIdColumn, ObjectID,
} from 'typeorm';

@Entity('Comments')
export default class Comments {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  postId: string;

  @Column()
  userId: string;

  @Column()
  content: string;

  @Column()
  likes: string[];
}
