import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../posts/post.entity';
import { Like } from './like.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async likePost(postId: number, telegramId: string): Promise<Like> {
    // Find the post
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    // Find or create the user
    let user = await this.userRepository.findOne({ where: { telegramId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the like already exists
    const existingLike = await this.likeRepository.findOne({
      where: { post, user },
    });
    if (existingLike) {
      throw new ConflictException('You already liked this post');
    }

    // Create and save the like
    const like = this.likeRepository.create({ post, user });
    await this.likeRepository.save(like);

    // Update the likeCount of the post
    post.likeCount += 1;
    await this.postRepository.save(post);

    return like;
  }

  async unlikePost(postId: number, telegramId: string): Promise<void> {
    // Find the post
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    // Find the user
    const user = await this.userRepository.findOne({ where: { telegramId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Log post and user for debugging
    console.log('Post:', post);
    console.log('User:', user);

    // Find the like
    const like = await this.likeRepository.findOne({
      where: {
        user: { id: user.id }, // Use user ID
        post: { id: post.id }, // Use post ID
      },
    });
    if (!like) {
      console.log('Like not found for post:', postId, 'and user:', telegramId);
      throw new NotFoundException('You have not liked this post');
    }

    // Remove the like
    await this.likeRepository.remove(like);

    // Update the likeCount of the post
    post.likeCount -= 1;
    await this.postRepository.save(post);
  }
}
