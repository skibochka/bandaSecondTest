import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-redis';
import { PublicController } from './public/public.controller';
import { PublicModule } from './public/public.module';
import BlogModule from './blog/blog.module';
import AuthModule from './auth/auth.module';
import Posts from './blog/entities/post.entity';
import Users from './users/entities/users.entity';
import Comments from './blog/entities/comment.entity';
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
    RedisModule.register({
      url: 'redis://127.0.0.1:6379',
      onClientReady: async (client): Promise<void> => {
        client.on('error', console.error);
      },
      reconnectOnError: (): boolean => true,
    }),
    BlogModule, AuthModule, UsersModule, PublicModule],
  controllers: [PublicController],
})
export default class AppModule {}
