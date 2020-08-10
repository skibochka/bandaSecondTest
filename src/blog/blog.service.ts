import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Posts from './entitys/post.entity';
import Comments from './entitys/comment.entity';
import postDto from './dto/post.dto';
import commentDto from './dto/comment.dto';

@Injectable()
export default class BlogService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,

    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
  ) {}

  newPost(data: postDto): Promise<Posts> {
    return this.postsRepository.save(data);
  }

  postUpdate(_id: string, data: any) {
    return this.postsRepository.update(_id, { title: data.title, content: data.content });
  }

  postLike(_id: string, likes: string[]) {
    return this.postsRepository.update(_id, { likes });
  }

  getPost(_id:string): Promise<Posts | undefined> {
    return this.postsRepository.findOne(_id);
  }

  newComment(data:commentDto): Promise<Comments> {
    return this.commentRepository.save(data);
  }

  getComment(_id:string) {
    return this.commentRepository.findOne(_id);
  }

  commentLike(_id:string, likes:string[]) {
    return this.commentRepository.update(_id, { likes });
  }
}
