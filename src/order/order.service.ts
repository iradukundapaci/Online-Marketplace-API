import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Status } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private kafkaService: KafkaService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { productId, quantity } = createOrderDto;

    // Check if the product exists and if there's sufficient stock
    const product = await this.prisma.product.findUnique({
      where: { productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Enqueue the order for processing
    await this.kafkaService.sendOrder(createOrderDto);

    // Return a confirmation to the user
    return { message: 'Order received and is being processed' };
  }

  async update(orderId: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(orderId);

    const updateData: any = {};

    if (updateOrderDto.quantity !== undefined) {
      const product = await this.prisma.product.findUnique({
        where: { productId: order.productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const stockDifference = updateOrderDto.quantity - order.quantity;

      if (product.stock < stockDifference) {
        throw new BadRequestException('Insufficient stock to update order');
      }

      await this.prisma.product.update({
        where: { productId: order.productId },
        data: { stock: product.stock - stockDifference },
      });

      updateData.totalPrice = product.price * updateOrderDto.quantity;
      updateData.quantity = updateOrderDto.quantity;
    }

    if (updateOrderDto.status !== undefined) {
      updateData.status = updateOrderDto.status;
    }

    return this.prisma.order.update({
      where: { orderId },
      data: updateData,
    });
  }

  async findOne(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { orderId },
      include: { product: true, owner: true },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { product: true, owner: true },
    });
  }

  async remove(orderId: number) {
    const order = await this.findOne(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.prisma.product.update({
      where: { productId: order.productId },
      data: { stock: order.product.stock + order.quantity },
    });

    return this.prisma.order.delete({ where: { orderId } });
  }

  async getOrderStatus(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { orderId },
      select: { status: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order.status;
  }

  async findAllForUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });
  }

  async updateStatus(orderId: number, status: Status) {
    const order = await this.prisma.order.findUnique({
      where: { orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { orderId },
      data: { status },
    });
  }
}
