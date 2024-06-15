// src/kafka/kafka.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly orderService: OrderService,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('process_order');
    await this.kafkaClient.connect();
  }

  async sendOrder(createOrderDto: CreateOrderDto) {
    this.kafkaClient.emit('process_order', createOrderDto);
  }

  async processOrder(data: CreateOrderDto) {
    return this.orderService.createOrderInQueue(data);
  }
}
