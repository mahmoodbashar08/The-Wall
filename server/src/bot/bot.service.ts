import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { UserService } from '../user/user.service'; // Ensure UserService is injected properly

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Telegraf;

  constructor(private readonly userService: UserService) {}

  async onModuleInit() {
    this.bot.start(async (ctx) => {
      const user = ctx.from;
      const startPayload = ctx.startPayload; // Referral ID

      let existingUser = await this.userService.findUserByTelegramId(
        user.id.toString(),
      );

      if (!existingUser) {
        existingUser = await this.userService.createUser(
          user.id.toString(),
          user.first_name,
          user.last_name,
          user.username,
          startPayload || null,
        );
      }

      await ctx.reply(`Click the button below to open the mini app.`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Open Mini App',
                web_app: {
                  url: 'https://4fv0hkkm-3000.euw.devtunnels.ms',
                },
              },
            ],
          ],
        },
      });
    });

    this.bot.on('pre_checkout_query', async (ctx) => {
      try {
        await ctx.answerPreCheckoutQuery(true);
        console.log('Pre-checkout query answered successfully.');
      } catch (err) {
        console.log(err, 'Error in pre-checkout query handler');
      }
    });

    this.bot.command('message', async (ctx) => {
      const fromUserId = ctx.from?.id;
      console.log(fromUserId);

      // Check if the command is sent by the specific user
      if (fromUserId === 583427713) {
        // Extract the message content after the command
        const messageContent = ctx.message.text.replace('/message', '').trim();

        if (!messageContent) {
          await ctx.reply('Please provide a message to broadcast.');
          return;
        }

        try {
          // Get all users from the database
          const allUsers = await this.userService.findAllUsers();

          for (const user of allUsers) {
            if (user.telegramId) {
              try {
                await this.bot.telegram.sendMessage(
                  user.telegramId,
                  messageContent,
                );
                console.log(
                  `Message sent to user with Telegram ID: ${user.telegramId}`,
                );
              } catch (err) {
                if (
                  err.response &&
                  err.response.error_code === 400 &&
                  err.response.description.includes('chat not found')
                ) {
                  console.log(
                    `Chat not found for user ${user.telegramId}. Skipping...`,
                  );
                } else {
                  console.error(
                    `Failed to send message to user ${user.telegramId}:`,
                    err,
                  );
                }
              }
            }
          }
          await ctx.reply('Message broadcasted successfully!');
        } catch (error) {
          console.error('Failed to broadcast message:', error);
          await ctx.reply(
            'Failed to broadcast the message. Please try again later.',
          );
        }
      } else {
        await ctx.reply('You are not authorized to use this command.');
      }
    });
    this.launchBot();
  }

  launchBot() {
    this.bot
      .launch()
      .then(() => {
        console.log('Bot is running...');
      })
      .catch((err) => {
        console.error('Error launching bot:', err);
      });
  }

  getBot(): Telegraf {
    return this.bot;
  }
  async sendMessageToUser(
    targetUserId: number,
    fromUserId: number,
  ): Promise<void> {
    try {
      // Check if the target user exists in the database
      const targetUser = await this.userService.findUserByTelegramId(
        targetUserId.toString(),
      );
      if (!targetUser) {
        console.error(
          `Target user with ID ${targetUserId} not found in the database.`,
        );
        return;
      }

      // Retrieve the "from" user's information for personalization
      const fromUser = await this.userService.findUserByTelegramId(
        fromUserId.toString(),
      );
      if (!fromUser) {
        console.error(
          `From user with ID ${fromUserId} not found in the database.`,
        );
        return;
      }

      // Construct the message
      const message = `You have a new post on your wall from ${fromUser.username}.`;

      // Send the message
      await this.bot.telegram.sendMessage(targetUserId, message);

      console.log(
        `Message sent to user ${targetUserId} from user ${fromUserId}`,
      );
    } catch (error) {
      console.error(`Failed to send message to user ${targetUserId}:`, error);
    }
  }
}
