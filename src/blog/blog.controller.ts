import { Controller, Post, Body } from '@nestjs/common';
import { BlogService } from './blog.service';
import { postDto } from './dto/post.dto';
import { commentDto } from './dto/comment.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @Post('/post')
  async Post(@Body() profile: postDto){
    profile.likes = '0';
    profile.comments = [];
    profile.createdAt = new Date().toLocaleDateString();
    return await this.blogService.NewPost(profile);
  }

  @Post('/comment')
  async newComment(@Body() profile: commentDto){
    const post: object  = await this.blogService.GetPost(profile._id);
    post['comments'].push({author: profile.author, content: profile.content, likes: "0"});
    return await this.blogService.NewComment(profile._id, post['comments']);
  }

  @Post('/update')
  async postUpdate(@Body() profile: postDto){
    const post: object  = await this.blogService.GetPost(profile._id);
    return await this.blogService.PostUpdate(profile._id, {title: profile.title, content: profile.content})
  }
}
