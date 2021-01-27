import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository, getConnectionToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Posts from './entities/post.entity';
import Comments from './entities/comment.entity';
import postDto from './dto/post.dto';
import commentDto from './dto/comment.dto';
import { IUpdate } from './interfaces/IUpdate';
import { ObjectID } from 'typeorm';

@Injectable()
export default class BlogService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
    @Inject(getConnectionToken())
    private readonly connection,
  ) {}

  newPost(data: postDto): Promise<Posts> {
    return this.postsRepository.save(data);
  }

  postUpdate(_id: ObjectID, data: IUpdate) {
    return this.postsRepository.update(_id, data);
  }

  postDelete(_id: ObjectID) {
    return this.postsRepository.delete(_id);
  }

  postLike(_id: ObjectID, likes: string[]) {
    return this.postsRepository.update(_id, { likes });
  }

  getPost(_id: ObjectID): Promise<Posts | undefined> {
    return this.postsRepository.findOne( _id );
  }

  getPosts(page): Promise<object> {
    return this.postsRepository.find({ skip: 2 * page, take: 2 });
  }

  countPosts(): Promise<number> {
    return this.postsRepository.count({});
  }

  getComments(_id: string): Promise<object> {
    return this.commentRepository.find({ postId: _id });
  }

  newComment(data: commentDto): Promise<Comments> {
    return this.commentRepository.save(data);
  }

  getComment(_id: ObjectID): Promise<Comments> {
    return this.commentRepository.findOne(_id);
  }

  commentLike(_id: ObjectID, likes: string[]) {
    return this.commentRepository.update(_id, { likes });
  }
}
