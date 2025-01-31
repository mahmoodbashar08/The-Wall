import { Injectable } from '@nestjs/common';
import { BotService } from '../bot/bot.service'; // Import BotService to get the bot instance

@Injectable()
export class StarsService {
  constructor(private readonly botService: BotService) {}

  async createInvoiceLink(userId: string): Promise<string> {
    try {
      const bot: any = this.botService.getBot(); // Get the bot instance from BotService
      const title = 'post on the wall';
      const description = 'post on the wall';
      const prices = [{ label: 'Post on the wall', amount: 10 }];

      const invoiceLink = await bot.telegram.createInvoiceLink({
        title: title,
        description: description,
        payload: 'payload',
        provider_token: '',
        currency: 'XTR',
        prices: prices,
      });

      return invoiceLink;
    } catch (error) {
      console.error('Error creating invoice link:', error);
      throw new Error('Error creating invoice link');
    }
  }
}
