import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { Post } from '../posts/post.entity';
import { User } from '../user/user.entity';
import { LikeService } from './likes.service';
import { LikeController } from './likes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Post, User])],
  providers: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
