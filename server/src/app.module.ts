import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { User } from './user/user.entity';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/post.entity';
import { UserModule } from './user/user.module';
import { LikeModule } from './likes/likes.module';
import { LikeController } from './likes/likes.controller';
import { LikeService } from './likes/likes.service';
import { Like } from './likes/like.entity';
import { StarsModule } from './stars/stars.module';
import { BotService } from './bot/bot.service';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Post, Like],
      synchronize: false, // For production environments
    }),
    TypeOrmModule.forFeature([User, Post, Like]),
    BotModule,
    UserModule,
    PostsModule,
    LikeModule,
    StarsModule,
  ],
  controllers: [UserController, LikeController],
  providers: [UserService, LikeService, BotService],
})
export class AppModule {}
