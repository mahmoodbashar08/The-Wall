import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity'; // Import Post entity
import { CreatePostDto } from './dto/create-post.dto'; // DTO for post creation

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get('global')
  async findGlobalWall(
    @Headers('authorization') telegramInitData: string,
  ): Promise<PostEntity[]> {
    if (!telegramInitData) {
      throw new BadRequestException('Telegram init data is missing');
    }

    const urlParams = new URLSearchParams(telegramInitData);
    const userData = urlParams.get('user');
    if (!userData) {
      throw new BadRequestException(
        'User data not found in the Telegram init data',
      );
    }

    const decodedUserData = decodeURIComponent(userData);

    let initData;
    try {
      initData = JSON.parse(decodedUserData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      throw new BadRequestException('Failed to parse user data');
    }

    // Extract user fields
    const telegramId = initData.id;

    return this.postsService.findGlobalWall(telegramId);
  }

  @Get('user/:userId')
  async findUserWall(@Param('userId') userId: string): Promise<PostEntity[]> {
    return this.postsService.findUserWall(userId);
  }
}
