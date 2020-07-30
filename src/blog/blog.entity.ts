import { Column, Entity, ObjectIdColumn, ObjectID} from 'typeorm';

@Entity('Posts')
export class Posts {
  @ObjectIdColumn() _id: ObjectID;

  @Column() article_id: string;

  @Column() title: string;

  @Column() content: string;

  @Column() likes: string;

  @Column() createdAt: string;

  @Column() comments: object;
}
