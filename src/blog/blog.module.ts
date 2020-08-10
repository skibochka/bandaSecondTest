import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import BlogController from './blog.controller';
import BlogService from './blog.service';
import Posts from './entitys/post.entity';
import Comments from './entitys/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Comments])],
  controllers: [BlogController],
  providers: [BlogService],
})
export default class BlogModule {}
