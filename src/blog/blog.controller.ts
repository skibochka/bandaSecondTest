import {
  Controller, Post, Body, Get, Param, UseGuards, HttpStatus, Response, Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import BlogService from './blog.service';
import postDto from './dto/post.dto';
import commentDto from './dto/comment.dto';
import 'dotenv/config';
import { IPost } from './interfaces/IPost';
import { IComment } from './interfaces/IComment';

@Controller('blog')
export default class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/post')
  async newPost(@Request() req, @Response() res, @Body() postData: postDto) {
    const token: string = req.headers.authorization.split(' ')[1];
    const payload: any = jwt.verify(token, process.env.KEY);
    const post: IPost = await this.blogService.newPost({
      _id: postData._id,
      title: postData.title,
      content: postData.content,
      likes: [],
      createdAt: new Date().toLocaleDateString(),
      userId: payload._id,
    });
    return res.status(HttpStatus.OK).json(post);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async postUpdate(@Response() res, @Request() req, @Body() postData: postDto) {
    const token = req.headers.authorization.split(' ')[1];
    const payload: any = jwt.verify(token, process.env.KEY);
    const post: IPost = await this.blogService.getPost(postData._id);

    if (post.userId === payload._id) {
      const result = await this.blogService.postUpdate(postData._id, {
        title: postData.title,
        content: postData.content,
      });
      return res.status(HttpStatus.OK).json(result);
    }
    return res.status(HttpStatus.BAD_REQUEST).json({ msg: 'Sorry, looks like it`s not your post' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/like')
  async postLike(@Request() req, @Response() res, @Body() data: postDto) {
    const token: string = req.headers.authorization.split(' ')[1];
    const payload: any = jwt.verify(token, process.env.KEY);
    const post: IPost = await this.blogService.getPost(data._id);
    const answer: boolean = post.likes.some((element) => payload._id === element);

    if (!answer) {
      post.likes.push(payload._id);
      const result = await this.blogService.postLike(data._id, post.likes);
      return res.status(HttpStatus.OK).json(result);
    }
    return 'You liked this post';
  }

  @Get(':id')
  async getPost(@Response() res, @Param('id') id): Promise<object> {
    const comments = await this.blogService.getComments(id);
    const post = await this.blogService.getPost(id);
    const data = {
      _id: post._id,
      title: post.title,
      content: post.content,
      userId: post.userId,
      likes: post.likes,
      createdAt: post.createdAt,
      comments,
    };
    return res.status(HttpStatus.OK).json(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/comment')
  async newComment(@Request() req, @Response() res, @Body() commentData: commentDto) {
    const token: string = req.headers.authorization.split(' ')[1];
    const payload: any = jwt.verify(token, process.env.KEY);
    const comment: IComment = await this.blogService.newComment({
      _id: commentData._id,
      postId: commentData.postId,
      userId: payload._id,
      content: commentData.content,
      likes: [],
    });

    return res.status(HttpStatus.OK).json(comment);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/likecomment')
  async likeComment(@Request() req, @Response() res, @Body() data: commentDto) {
    const token: string = req.headers.authorization.split(' ')[1];
    const payload: any = jwt.verify(token, process.env.KEY);
    const comment: IComment = await this.blogService.getComment(data._id);
    const answer: boolean = comment.likes.some((element) => payload._id === element);

    if (!answer) {
      comment.likes.push(payload._id);
      const result = await this.blogService.commentLike(data._id, comment.likes);
      return res.status(HttpStatus.OK).json(result);
    }
    return res.status(HttpStatus.OK).json({ msg: 'You have already liked this comment' });
  }
}
