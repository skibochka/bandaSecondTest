import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './blog.entity';
import { postDto} from './dto/post.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}

  NewPost(data:postDto): Promise<Posts>{
    return this.postsRepository.save(data);
  }

  GetPost(_id:string){
    return this.postsRepository.findOne(_id);
  }

  NewComment(_id:string, comments:object){
    return this.postsRepository.update( _id , { comments } );
  }

  PostUpdate(_id:string, data:object){
    return this.postsRepository.update( _id , { title: data['title'], content: data['content'] });
  }
}
