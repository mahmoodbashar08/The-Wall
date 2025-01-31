import { Module } from '@nestjs/common';
import { StarsService } from './stars.service';
import { StarsController } from './stars.controller';
import { BotService } from '../bot/bot.service'; // Import BotService
import { UserModule } from '../user/user.module'; // Import UserModule to make UserService available
import { BotModule } from 'src/bot/bot.module';

@Module({
  imports: [UserModule, BotModule], // Import UserModule here
  providers: [StarsService, BotService], // Provide BotService and StarsService
  controllers: [StarsController],
})
export class StarsModule {}
