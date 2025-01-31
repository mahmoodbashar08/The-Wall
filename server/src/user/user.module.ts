// user.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity'; // Import User entity
import { Post } from '../posts/post.entity'; // Import Post entity
import { Like } from 'src/likes/like.entity';
import { PostsModule } from 'src/posts/posts.module'; // Import PostsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, Like]), // Import entities including User
    forwardRef(() => PostsModule), // Use forwardRef to handle potential circular dependency
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export UserService so it can be used in other modules
})
export class UserModule {}
