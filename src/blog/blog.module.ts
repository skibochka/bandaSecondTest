import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogService } from './blog.service';
import { Posts } from './blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts])],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule {}
