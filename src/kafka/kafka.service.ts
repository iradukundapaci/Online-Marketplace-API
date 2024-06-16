// src/kafka/kafka.service.ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.kafka = new Kafka({
      clientId: 'nestjs-app',
      brokers: [this.configService.get('KAFKA_BROKER')],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'nestjs-group' });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();

    await this.consumer.subscribe({
      topic: 'process_order',
      fromBeginning: true,
    });

    this.consumer.run({
      eachMessage: async ({ message }) => {
        const createOrderDto = JSON.parse(message.value.toString());
        await this.processOrder(createOrderDto);
      },
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async sendOrder(createOrderDto: CreateOrderDto) {
    await this.producer.send({
      topic: 'process_order',
      messages: [{ value: JSON.stringify(createOrderDto) }],
    });
  }

  async processOrder(createOrderDto: CreateOrderDto) {
    const { userId, productId, quantity } = createOrderDto;

    const product = await this.prisma.product.findUnique({
      where: { productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const totalPrice = product.price * quantity;

    // Update product stock
    await this.prisma.product.update({
      where: { productId },
      data: { stock: product.stock - quantity },
    });

    // Create the order
    await this.prisma.order.create({
      data: {
        userId,
        productId,
        quantity,
        totalPrice,
        status: Status.PENDING,
      },
    });
  }
}
