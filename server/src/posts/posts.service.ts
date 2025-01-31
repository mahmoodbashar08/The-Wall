import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto'; // DTO for post creation
import { User } from 'src/user/user.entity';
import { BotService } from 'src/bot/bot.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly botService: BotService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { content, authorId, targetUserId, isPaid } = createPostDto;

    // Find the author
    const author = await this.userRepository.findOne({
      where: { telegramId: authorId },
    });
    if (!author) {
      throw new NotFoundException(
        `User with Telegram ID ${authorId} not found`,
      );
    }
    let currentReferralPostCount;
    if (isPaid === false) {
      // Check if the author has enough referral post count
      currentReferralPostCount = parseInt(author.referralPostCount || '0');
      if (currentReferralPostCount < 5) {
        throw new BadRequestException(
          'Not enough referral post count to create a post',
        );
      }
    }

    // Find the target user (if provided)
    let targetUser = null;
    if (targetUserId) {
      targetUser = await this.userRepository.findOne({
        where: { telegramId: targetUserId },
      });
      if (!targetUser) {
        throw new NotFoundException(
          `Target user with Telegram ID ${targetUserId} not found`,
        );
      }
    }
    if (isPaid === false) {
      // Decrement the referral post count
      author.referralPostCount = (currentReferralPostCount - 5).toString();
      await this.userRepository.save(author);
    }
    // Create the post
    const post = this.postRepository.create({
      content,
      user: author, // Link the post to the author
      targetUser: targetUser || null, // Link to the target user if available
    });

    const savedPost = await this.postRepository.save(post);

    // Send a message to the target user if provided
    if (targetUser) {
      await this.botService.sendMessageToUser(
        parseInt(targetUser.telegramId),
        parseInt(author.telegramId),
      );
    }

    return savedPost;
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['user'], // Load user relation
    });
  }

  async findGlobalWall(requestingUserId: string): Promise<any[]> {
    // Fetch global posts
    const globalPosts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user') // Include the post's author
      .where('post.targetUser IS NULL')
      .orderBy('post.createdAt', 'DESC')
      .take(100)
      .getMany();

    // Check if the requesting user liked each post
    const postsWithLikeStatus = await Promise.all(
      globalPosts.map(async (post) => {
        const hasLiked = await this.userRepository
          .createQueryBuilder('user')
          .leftJoin('user.likes', 'like')
          .where('like.postId = :postId', { postId: post.id })
          .andWhere('user.telegramId = :requestingUserId', { requestingUserId })
          .getCount();

        return {
          ...post,
          isLiked: hasLiked > 0, // true if the user has liked the post
        };
      }),
    );

    return postsWithLikeStatus;
  }

  async findUserWall(userId: string): Promise<Post[]> {
    const user = await this.userRepository.findOne({
      where: { telegramId: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with Telegram ID ${userId} not found`);
    }

    return this.postRepository.find({
      where: { targetUser: user },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }
}
