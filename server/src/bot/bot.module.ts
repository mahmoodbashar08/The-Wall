// bot.module.ts

import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [BotService],
  exports: [BotService], // Export BotService so it can be used in other modules
})
export class BotModule {}
