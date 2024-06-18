import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [KafkaModule, PrismaModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
