// src/payment/payment.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly baseURL = 'https://api.flutterwave.com/v3';
  private readonly secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

  constructor(private readonly prisma: PrismaService) {}

  async initiatePayment(orderId: number, userId: number) {
    const order = await this.prisma.order.findUnique({
      where: { orderId: orderId, userId: userId },
      include: { owner: true, product: true },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const payload = {
      tx_ref: `tx-${order.orderId}`,
      amount: order.totalPrice,
      currency: 'USD',
      redirect_url: 'http://localhost:3000/payment/callback',
      payment_type: 'card',
      customer: {
        email: order.owner.email,
        name: order.owner.names,
      },
      customizations: {
        title: 'My Store Payment',
        description: `Payment for {order.quantity} {order.product.name}`,
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
