import {
  Controller,
  Post,
  Param,
  Delete,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { LikeService } from './likes.service';
import { Like } from './like.entity';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':postId')
  async likePost(
    @Param('postId') postId: number,
    @Headers('authorization') telegramInitData: string,
  ): Promise<Like> {
    const telegramId = this.extractTelegramId(telegramInitData);
    return this.likeService.likePost(postId, telegramId);
  }

  @Delete(':postId')
  async unlikePost(
    @Param('postId') postId: number,
    @Headers('authorization') telegramInitData: string,
  ): Promise<void> {
    const telegramId = this.extractTelegramId(telegramInitData);
    return this.likeService.unlikePost(postId, telegramId);
  }

  private extractTelegramId(telegramInitData: string): string {
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

    return initData.id; // Extract and return Telegram ID
  }
}
