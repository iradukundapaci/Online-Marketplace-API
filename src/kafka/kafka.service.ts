// src/kafka/kafka.service.ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Kafka, Producer, Consumer, Admin } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private admin: Admin;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.kafka = new Kafka({
      clientId: 'nestjs-app',
      brokers: [this.configService.get<string>('KAFKA_BROKER')],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'nestjs-group' });
    this.admin = this.kafka.admin();
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.admin.connect();

    // Create the topic if it does not exist
    await this.createTopic('process_order', 1, 1);

    await this.consumer.subscribe({
      topic: 'process_order',
      fromBeginning: true,
    });

    this.consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const createOrderDto: CreateOrderDto = JSON.parse(
            message.value.toString(),
          );
          await this.processOrder(createOrderDto);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    await this.admin.disconnect();
  }

  async createTopic(
    topic: string,
    numPartitions: number,
    replicationFactor: number,
  ) {
    const topics = await this.admin.listTopics();
    if (!topics.includes(topic)) {
      await this.admin.createTopics({
        topics: [
          {
            topic,
            numPartitions,
            replicationFactor,
          },
        ],
      });
    }
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
