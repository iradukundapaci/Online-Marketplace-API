import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly baseURL = 'https://api.flutterwave.com/v3';
  private readonly secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

  async initiatePayment(
    amount: number,
    currency: string,
    tx_ref: string,
    customer: any,
  ) {
    const payload = {
      tx_ref,
      amount,
      currency,
      redirect_url: 'http://localhost:3000/payment/callback',
      payment_type: 'card',
      customer,
      customizations: {
        title: 'My Store Payment',
        description: 'Payment for items in cart',
      },
    };

    try {
      const response = await axios.post(`${this.baseURL}/payments`, payload, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error(error.message);
      throw new Error('Failed to initiate payment');
    }
  }

  async verifyPayment(tx_ref: string) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transactions/${tx_ref}/verify`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(error.message);
      throw new Error('Failed to verify payment');
    }
  }
}
