import {
  Controller, Post, Body, Get, Param, UseGuards, HttpStatus, Response, Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import BlogService from './blog.service';
import postDto from './dto/post.dto';
import commentDto from './dto/comment.dto';
import 'dotenv/config';
import { IPost } from './Interfaces/IPost';
import { IComment } from './Interfaces/IComment';

@Controller('blog')
export default class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/post')
  async newPost(@Request() req, @Response() res, @Body() profile: postDto) {
    const token = req.headers.authorization.split(' ')[1];
    const payload: any = jwt.verify(token, process.env.KEY);
    const post = await this.blogService.newPost({
      _id: profile._id,
      title: profile.title,
      content: profile.content,
      likes: [],
      createdAt: new Date().toLocaleDateString(),
      userId: payload._id,
      comments: [],
    });
    return res.status(HttpStatus.OK).json(post);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async postUpdate(@Response() res, @Request() req, @Body() profile: postDto) {
    const token = req.headers.authorization.split(' ')[1];
    const payload: any = jwt.verify(token, process.env.KEY);
    const post: IPost = await this.blogService.getPost(profile._id);

    if (post.userId === payload._id) {
      const result = await this.blogService.postUpdate(profile._id, { title: profile.title, content: profile.content });
      return res.status(HttpStatus.OK).json(result);
    }
    return res.status(HttpStatus.BAD_REQUEST).json({ msg: 'Sorry, looks like it`s not your post' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/like')
  async postLike(@Request() req, @Response() res, @Body() profile: postDto) {
    const token = req.headers.authorization.split(' ')[1];
    const payload: any = jwt.verify(token, process.env.KEY);
    const post: IPost = await this.blogService.getPost(profile._id);
    const answer: boolean = post.likes.some((element) => payload._id === element);

    if (!answer) {
      post.likes.push(payload._id);
      const result = await this.blogService.postLike(profile._id, post.likes);
      return res.status(HttpStatus.OK).json(result);
    }
    return 'You liked this post';
  }

  @Get(':id')
  async getPost(@Response() res, @Param('id') id): Promise<object> {
    const post = await this.blogService.getPost(id);
    return res.status(HttpStatus.OK).json(post);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/comment')
  async newComment(@Request() req, @Response() res, @Body() profile: commentDto) {
    const token = req.headers.authorization.split(' ')[1];
    const payload: any = jwt.verify(token, process.env.KEY);
    const comment = await this.blogService.newComment({
      _id: profile._id,
      postId: profile.postId,
      userId: payload._id,
      content: profile.content,
      likes: [],
    });

    return res.status(HttpStatus.OK).json(comment);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/likecomment')
  async likeComment(@Request() req, @Response() res, @Body() profile: commentDto) {
    const token = req.headers.authorization.split(' ')[1];
    const payload: any = jwt.verify(token, process.env.KEY);
    const comment: IComment = await this.blogService.getComment(profile._id);
    const answer: boolean = comment.likes.some((element) => payload._id === element);

    if (!answer) {
      comment.likes.push(payload._id);
      const result = await this.blogService.commentLike(profile._id, comment.likes);
      return res.status(HttpStatus.OK).json(result);
    }
    return res.status(HttpStatus.OK).json({ msg: 'You have already liked this comment' });
  }
}
