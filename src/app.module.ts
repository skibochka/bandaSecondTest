import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogModule } from './blog/blog.module';
import { AuthModule } from './auth/auth.module';
import { Posts } from './blog/blog.entity';
import { Users } from './auth/auth.entity';
import 'dotenv/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URI,
      database: 'blog_db',
      entities: [Posts, Users],
      logging: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
    BlogModule, AuthModule]
})
export class AppModule {}
