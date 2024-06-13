// src/order/order.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: createOrderDto,
    });
  }

  async findAll() {
    return this.prisma.order.findMany();
  }

  async findOne(orderId: number) {
    return this.prisma.order.findUnique({
      where: { orderId },
    });
  }

  async update(orderId: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { orderId },
      data: updateOrderDto,
    });
  }

  async remove(orderId: number) {
    return this.prisma.order.delete({
      where: { orderId },
    });
  }
}
