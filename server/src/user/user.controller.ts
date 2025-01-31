import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  HttpStatus,
  Res,
  Headers,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Response } from 'express';
import { Post as PostEntity } from '../posts/post.entity';
import { PostsService } from 'src/posts/posts.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly postsService: PostsService, // Add PostsService
  ) {}
  @Post('check')
  async checkUser(
    @Headers('x-start-param') startParam: string | null | undefined, // Extract startParam from headers
    @Headers('x-profile-image') profileImage: string | null | undefined, // Extract profileImage from headers
    @Headers('authorization') initData: string, // Extracting init_data from authorization header
    @Res() res: Response, // Manually handling the response
  ) {
    try {
      // Call the method to check and create the user
      const { userCreated, userData } =
        await this.userService.checkAndCreateUser(
          initData,
          startParam,
          profileImage,
        );

      // Return the result (true or false) in the response body, along with the user data
      return res.status(HttpStatus.OK).json({
        userCreated,
        user: userData,
      });
    } catch (error) {
      // Handle the error and send the response manually
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error processing user data', error });
    }
  }

  @Post()
  async createUser(
    @Body('telegramId') telegramId: string,
    @Body('firstName') firstName?: string,
    @Body('lastName') lastName?: string,
    @Body('username') username?: string,
    @Body('referralBy') referralBy?: string, // Accept referralBy in the request body
  ): Promise<User> {
    return await this.userService.createUser(
      telegramId,
      firstName,
      lastName,
      username,
      referralBy,
    );
  }

  @Get(':telegramId')
  async getUser(
    @Param('telegramId') telegramId: string,
  ): Promise<{ user: User; posts: PostEntity[] }> {
    // Fetch the user
    const user = await this.userService.findUserByTelegramId(telegramId);
    if (!user) {
      throw new NotFoundException(
        `User with Telegram ID ${telegramId} not found`,
      );
    }

    // Fetch the user's wall posts
    const posts = await this.postsService.findUserWall(telegramId);

    // Return user data along with posts
    return { user, posts };
  }
  @Get('username/:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<{ users: User[] }> {
    const users = await this.userService.findUserByTelegramUsername(username);

    if (!users.length) {
      return { users: [] }; // Return an empty array if no users are found
    }

    return { users };
  }

  @Get('referrals/:telegramId')
  async getReferralsByTelegramId(
    @Param('telegramId') telegramId: string,
  ): Promise<{ referringUser: User; referrals: User[] }> {
    // Fetch the referrals
    const referrals =
      await this.userService.findUsersReferredByTelegramId(telegramId);

    // Fetch the referring user details
    const referringUser =
      await this.userService.findUserByTelegramId(telegramId);

    return { referringUser, referrals };
  }

  @Patch(':telegramId')
  async updateUser(
    @Param('telegramId') telegramId: string,
    @Body() updates: Partial<User>,
  ): Promise<User> {
    return await this.userService.updateUser(telegramId, updates);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }
}
