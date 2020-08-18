import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Posts from './entities/post.entity';
import Comments from './entities/comment.entity';
import postDto from './dto/post.dto';
import commentDto from './dto/comment.dto';
import { IUpdate } from './interfaces/IUpdate';

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

  postUpdate(_id: string, data: IUpdate) {
    return this.postsRepository.update(_id, data);
  }

  postLike(_id: string, likes: string[]) {
    return this.postsRepository.update(_id, { likes });
  }

  getPost(_id: string): Promise<Posts | undefined> {
    return this.postsRepository.findOne(_id);
  }

  getComments(_id: string): Promise<object> {
    return this.commentRepository.find({ postId: _id });
  }

  newComment(data: commentDto): Promise<Comments> {
    return this.commentRepository.save(data);
  }

  getComment(_id: string): Promise<Comments> {
    return this.commentRepository.findOne(_id);
  }

  commentLike(_id: string, likes:string[]) {
    return this.commentRepository.update(_id, { likes });
  }
}
