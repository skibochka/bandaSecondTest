import { Column, Entity, ObjectIdColumn, ObjectID} from 'typeorm';

@Entity('Users')
export class Users {
  @ObjectIdColumn() id: ObjectID;

  @Column() userId: string;

  @Column() fullName: string;

  @Column() email: string;

  @Column() password: string;
}
