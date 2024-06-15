// src/kafka/kafka.controller.ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';

@Controller()
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  @EventPattern('process_order')
  async handleOrder(@Payload() message: any) {
    await this.kafkaService.processOrder(message.value);
  }
}
