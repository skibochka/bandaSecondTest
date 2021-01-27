import { Body, Controller, Param, HttpStatus, Post, Get, Delete, Request, Response, UseGuards } from '@nestjs/common';
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
  constructor(private readonly blogService: BlogService) {
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/post')
  async newPost(@Request() req, @Response() res, @Body() postData: postDto) {
    const payload = BlogController.getUserPayload(req);
    const post: IPost = await this.blogService.newPost({
      _id: postData._id,
      title: postData.title,
      content: postData.content,
      likes: [],
      userId: payload._id,
      createdAt: new Date().toLocaleDateString(),
    });
    return res.status(HttpStatus.OK).json(post);
  }

  @Get('/post/:id')
  async getPost(@Param('id') id, @Response() res) {
    const post: IPost = await this.blogService.getPost(id);
    return res.status(HttpStatus.OK).json(post);
  }


  @Get('/post/:id/comments')
  async getComments(@Param('id') id, @Response() res) {
    const comments = await this.blogService.getComments(id);
    return res.status(HttpStatus.OK).json(comments);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/post/update')
  async postUpdate(@Response() res, @Request() req, @Body() postData: postDto) {
    const payload = BlogController.getUserPayload(req);
    const post: IPost = await this.blogService.getPost(postData._id);

    if (post.userId !== payload._id) {
      return res.status(HttpStatus.OK).json({ msg: 'Sorry, it`s not your post' });
    }

    const result = await this.blogService.postUpdate(postData._id, {
      title: postData.title,
      content: postData.content,
    });
    return res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('post/:id/delete')
  async postDelete(@Param('id') id, @Response() res, @Request() req) {
    const payload = BlogController.getUserPayload(req);
    const post: IPost = await this.blogService.getPost(id);

    if (post.userId !== payload._id) {
      return res.status(HttpStatus.OK).json({ msg: 'Sorry, it`s not your post' });
    }

    const result = await this.blogService.postDelete(id);
    return res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/post/:id/like')
  async postLike(@Param('id') id, @Request() req, @Response() res) {
    const payload = BlogController.getUserPayload(req)
    const post: IPost = await this.blogService.getPost(id);
    const answer: boolean = post.likes.includes(payload._id);

    if (!answer) {
      post.likes.push(payload._id);
      const result = await this.blogService.postLike(id, post.likes);
      return res.status(HttpStatus.OK).json(result);
    }
    return res.status(HttpStatus.OK).json({ msg: 'You have already liked this comment' });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/post/comment')
  async newComment(@Request() req, @Response() res, @Body() commentData: commentDto) {
    const payload = BlogController.getUserPayload(req);
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
  @Post('/post/comment/like/:id')
  async likeComment(@Param('id') id, @Request() req, @Response() res) {
    const payload = BlogController.getUserPayload(req);
    const comment: IComment = await this.blogService.getComment(id);
    const answer: boolean = comment.likes.includes(payload._id);

    if (!answer) {
      comment.likes.push(payload._id);
      const result = await this.blogService.commentLike(id, comment.likes);
      return res.status(HttpStatus.OK).json(result);
    }
    return res.status(HttpStatus.OK).json({ msg: 'You have already liked this comment' });
  }

  @Get('/page/:page')
  async getPosts(@Param('page') page, @Response() res) {
    const posts = await this.blogService.getPosts(parseInt(page));
    return res.status(HttpStatus.OK).json(posts);
  }

  @Get('/count')
  async countPosts(@Response() res) {
    const posts = await this.blogService.countPosts();
    return res.status(HttpStatus.OK).json(posts);
  }

  private static getUserPayload(req): any {
    const token: string = req.headers.authorization.split(' ')[1];
    return jwt.verify(token, process.env.KEY);
  }
}
