import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Verify Telegram WebApp data (for security purposes)
  async verifyTelegramWebAppData(telegramInitData: string): Promise<boolean> {
    const initData = new URLSearchParams(telegramInitData);
    const hash = initData.get('hash');
    const dataToCheck: string[] = [];

    initData.sort();
    initData.forEach((val, key) => {
      if (key !== 'hash') {
        dataToCheck.push(`${key}=${val}`);
      }
    });

    const secret = CryptoJS.HmacSHA256(
      process.env.TELEGRAM_BOT_TOKEN,
      'WebAppData',
    );

    const _hash = CryptoJS.HmacSHA256(dataToCheck.join('\n'), secret).toString(
      CryptoJS.enc.Hex,
    );

    return hash === _hash;
  }

  // Check if the user exists, create a new user if not
  async checkAndCreateUser(
    telegramInitData: string,
    startParam: string | null | undefined, // Referral parameter
    userProfileImage: string | null | undefined, // Profile image
  ): Promise<{ userCreated: boolean; userData: User }> {
    // Verify the Telegram WebApp data
    const isVerified = await this.verifyTelegramWebAppData(telegramInitData);

    if (!isVerified) {
      throw new BadRequestException('Invalid Telegram data');
    }

    // Extract and parse user data
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
    const firstName = initData.first_name;
    const lastName = initData.last_name;
    const username = initData.username;
    const referralBy = startParam || null;

    if (!telegramId) {
      throw new BadRequestException('Telegram ID is required');
    }

    // Check if the user already exists
    let existingUser = await this.findUserByTelegramId(telegramId);

    if (!existingUser) {
      // If user doesn't exist, create a new one
      existingUser = await this.createUser(
        telegramId,
        firstName,
        lastName,
        username,
        referralBy,
      );

      // Update with profile image if provided
      if (userProfileImage) {
        existingUser.profileImage = userProfileImage;
        await this.userRepository.save(existingUser);
      }

      return { userCreated: true, userData: existingUser };
    }

    // If the user exists, check if the image is new
    if (
      userProfileImage &&
      (!existingUser.profileImage ||
        existingUser.profileImage !== userProfileImage)
    ) {
      existingUser.profileImage = userProfileImage;
      await this.userRepository.save(existingUser);
    } else {
      console.log(
        `Profile image for user ${telegramId} is already up-to-date.`,
      );
    }

    return { userCreated: false, userData: existingUser };
  }
  // Find user by Telegram username
  async findUserByTelegramUsername(username: string): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.username LIKE :username', { username: `%${username}%` })
      .getMany();
  }

  // Find all users referred by a specific Telegram ID
  async findUsersReferredByTelegramId(telegramId: string): Promise<User[]> {
    // Validate the referring user exists
    const referringUser = await this.findUserByTelegramId(telegramId);

    if (!referringUser) {
      throw new NotFoundException(
        `User with Telegram ID ${telegramId} not found`,
      );
    }

    // Query for users where `referralBy` matches the provided Telegram ID
    return await this.userRepository.find({
      where: { referralBy: telegramId },
    });
  }

  // Create new user
  async createUser(
    telegramId: string,
    firstName?: string,
    lastName?: string,
    username?: string,
    referralBy?: string | null, // referralBy can now be null
  ): Promise<User> {
    if (!telegramId) {
      throw new BadRequestException('Telegram ID is required');
    }
    let existingUser = await this.findUserByTelegramId(telegramId);
    if (!existingUser) {
      // Handle referral system if referralBy is provided
      if (referralBy) {
        const referringUser = await this.findUserByTelegramId(referralBy);
        if (!referringUser) {
          throw new NotFoundException(
            `Referring user with Telegram ID ${referralBy} not found`,
          );
        }

        referringUser.referralPostCount = (
          parseInt(referringUser.referralPostCount || '0') + 1
        ).toString();

        referringUser.referralTotalCount = (
          parseInt(referringUser.referralTotalCount || '0') + 1
        ).toString();

        await this.userRepository.save(referringUser); // Update referring user
      }

      // Create and save the new user
      const newUser = this.userRepository.create({
        telegramId,
        firstName,
        lastName,
        username,
        referralBy,
      });

      return await this.userRepository.save(newUser);
    }
  }

  // Find user by Telegram ID
  async findUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { telegramId } });
  }

  // Update user data
  async updateUser(telegramId: string, updates: Partial<User>): Promise<User> {
    await this.userRepository.update({ telegramId }, updates);
    return this.findUserByTelegramId(telegramId);
  }

  // Get all users
  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
