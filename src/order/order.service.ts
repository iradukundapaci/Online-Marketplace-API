import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Status } from '@prisma/client';
import { MailerService } from 'src/mailer/mailer.service';
import { KafkaService } from 'src/kafka/kafka.service'; // Import the KafkaService

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private kafkaService: KafkaService, // Inject the KafkaService
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    // Send order to Kafka instead of processing immediately
    await this.kafkaService.sendOrder(createOrderDto);
    return { message: 'Order is being processed' };
  }

  // Process order inside the queue
  async createOrderInQueue(createOrderDto: CreateOrderDto) {
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

    const order = await this.prisma.order.create({
      data: {
        userId,
        productId,
        quantity,
        totalPrice,
        status: Status.PENDING,
      },
    });

    // Send confirmation email
    const userEmail = (await this.prisma.user.findUnique({ where: { userId } }))
      .email;
    await this.mailerService.sendMail(
      userEmail,
      'Order Confirmation',
      `Your order with ID ${order.orderId} has been placed successfully.`,
    );

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { product: true, owner: true },
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

      const newTotalPrice = product.price * updateOrderDto.quantity;
      const stockDifference = updateOrderDto.quantity - order.quantity;

      if (product.stock < stockDifference) {
        throw new BadRequestException('Insufficient stock to update order');
      }

      await this.prisma.product.update({
        where: { productId: order.productId },
        data: { stock: product.stock - stockDifference },
      });

      updateData.totalPrice = newTotalPrice;
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
      include: { owner: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { orderId },
      data: { status },
    });

    // Send email notification to the user
    const userEmail = order.owner.email; // Assuming 'owner' has an 'email' field
    await this.mailerService.sendMail(
      userEmail,
      'Order Status Update',
      `Your order status has been updated to: ${status}`,
    );

    return updatedOrder;
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

  async remove(orderId: number) {
    const order = await this.findOne(orderId);

    await this.prisma.product.update({
      where: { productId: order.productId },
      data: { stock: order.product.stock + order.quantity },
    });

    return this.prisma.order.delete({ where: { orderId } });
  }
}
