import { Controller, Get, Param } from '@nestjs/common';
import { StarsService } from './stars.service';

@Controller('stars')
export class StarsController {
  constructor(private readonly starsService: StarsService) {}

  // Endpoint to create an invoice link
  @Get('createInvoice/:userId')
  async createInvoice(@Param('userId') userId: string) {
    const invoiceLink = await this.starsService.createInvoiceLink(userId);
    return { url: invoiceLink }; // Send the generated invoice link to the frontend
  }
}
