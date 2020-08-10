import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import BlogModule from './blog/blog.module';
import AuthModule from './auth/auth.module';
import Posts from './blog/entitys/post.entity';
import Users from './users/users.entity';
import Comments from './blog/entitys/comment.entity';
import UsersModule from './users/users.module';
import 'dotenv/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URI,
      database: 'blog_db',
      entities: [Posts, Users, Comments],
      logging: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    BlogModule, AuthModule, UsersModule],
})
export default class AppModule {}
