import { Controller, Post, Body, Get, Query, Logger } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  async initiatePayment(@Body() paymentDto: any) {
    const { amount, currency, tx_ref, customer } = paymentDto;
    return this.paymentService.initiatePayment(
      amount,
      currency,
      tx_ref,
      customer,
    );
  }

  @Get('callback')
  async handleCallback(@Query() query: any) {
    const { tx_ref } = query;
    const verificationResponse =
      await this.paymentService.verifyPayment(tx_ref);
    this.logger.log(
      `Payment verification response: ${JSON.stringify(verificationResponse)}`,
    );
    return verificationResponse;
  }
}
