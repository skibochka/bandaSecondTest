import {
  Entity, Column, BeforeInsert, ObjectIdColumn, ObjectID,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('Users')
export default class Users {
  @ObjectIdColumn() _id: ObjectID;

  @Column() firstName: string;

  @Column() email: string;

  @Column() password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string):Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
  }
}
