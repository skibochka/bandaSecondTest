import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import BlogController from './blog.controller';
import BlogService from './blog.service';
import Posts from './entities/post.entity';
import Comments from './entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, Comments])
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export default class BlogModule {}
