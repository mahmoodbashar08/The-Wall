// posts.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity'; // Import Post entity
import { UserModule } from 'src/user/user.module'; // Import UserModule to access UserRepository
import { BotService } from 'src/bot/bot.service'; // Assuming BotService is defined
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User]), // Add User here
    forwardRef(() => UserModule),
  ],
  controllers: [PostsController],
  providers: [PostsService, BotService],
  exports: [PostsService],
})
export class PostsModule {}
