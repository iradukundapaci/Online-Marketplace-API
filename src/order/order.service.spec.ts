import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '../kafka/kafka.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Status } from '@prisma/client';

describe('OrderService', () => {
  let service: OrderService;
  let prisma: PrismaService;
  let kafka: KafkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: {
            order: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            product: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: KafkaService,
          useValue: {
            sendOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prisma = module.get<PrismaService>(PrismaService);
    kafka = module.get<KafkaService>(KafkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        productId: 1,
        quantity: 2,
      };
      const product = { productId: 1, stock: 10, price: 100 };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);
      (kafka.sendOrder as jest.Mock).mockResolvedValue(undefined);

      const result = await service.create(createOrderDto);
      expect(result).toEqual({
        message: 'Order received and is being processed',
      });
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { productId: createOrderDto.productId },
      });
      expect(kafka.sendOrder).toHaveBeenCalledWith(createOrderDto);
    });

    it('should throw NotFoundException if product not found', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        productId: 1,
        quantity: 2,
      };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.create(createOrderDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if insufficient stock', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 1,
        productId: 1,
        quantity: 2,
      };
      const product = { productId: 1, stock: 1, price: 100 };

      (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);

      await expect(service.create(createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update an order successfully', async () => {
      const orderId = 1;
      const updateOrderDto: UpdateOrderDto = { quantity: 3 };
      const order = {
        orderId,
        productId: 1,
        quantity: 2,
        totalPrice: 200,
        product: {
          productId: 1,
          userId: 1,
          categoryId: 1,
          name: 'Product',
          description: 'Product Description',
          price: 100,
          stock: 10,
          tag: 'Tag',
          imageUrl: 'image.jpg',
          isFeatured: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        owner: {
          userId: 1,
          name: 'User Name',
          email: 'user@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      const product = {
        productId: 1,
        stock: 10,
        price: 100,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(order as any); // Cast as any to simplify
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);
      (prisma.order.update as jest.Mock).mockResolvedValue({
        ...order,
        quantity: 3,
        totalPrice: 300,
      });

      const result = await service.update(orderId, updateOrderDto);
      expect(result).toEqual({
        ...order,
        quantity: 3,
        totalPrice: 300,
      });
      expect(service.findOne).toHaveBeenCalledWith(orderId);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { productId: order.product.productId },
      });
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { orderId },
        data: { quantity: 3, totalPrice: 300 },
      });
    });

    it('should throw NotFoundException if product not found on update', async () => {
      const orderId = 1;
      const updateOrderDto: UpdateOrderDto = { quantity: 3 };
      const order = {
        orderId,
        productId: 1,
        quantity: 2,
        totalPrice: 200,
        product: {
          productId: 1,
          userId: 1,
          categoryId: 1,
          name: 'Product',
          description: 'Product Description',
          price: 100,
          stock: 10,
          tag: 'Tag',
          imageUrl: 'image.jpg',
          isFeatured: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        owner: {
          userId: 1,
          name: 'User Name',
          email: 'user@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(order as any); // Cast as any to simplify
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(orderId, updateOrderDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    // it('should throw BadRequestException if insufficient stock on update', async () => {
    //   const orderId = 1;
    //   const updateOrderDto: UpdateOrderDto = { quantity: 3 };
    //   const order = {
    //     orderId,
    //     productId: 1,
    //     quantity: 2,
    //     totalPrice: 200,
    //     product: {
    //       productId: 1,
    //       userId: 1,
    //       categoryId: 1,
    //       name: 'Product',
    //       description: 'Product Description',
    //       price: 100,
    //       stock: 10,
    //       tag: 'Tag',
    //       imageUrl: 'image.jpg',
    //       isFeatured: false,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     owner: {
    //       userId: 1,
    //       name: 'User Name',
    //       email: 'user@example.com',
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //   };
    //   const product = {
    //     productId: 1,
    //     stock: 2, // Insufficient stock to update
    //     price: 100,
    //   };

    //   jest.spyOn(service, 'findOne').mockResolvedValue(order as any); // Cast as any to simplify
    //   (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);

    //   await expect(service.update(orderId, updateOrderDto)).rejects.toThrow(
    //     BadRequestException,
    //   );
    // });
  });

  describe('findOne', () => {
    it('should return an order successfully', async () => {
      const orderId = 1;
      const order = {
        orderId,
        productId: 1,
        quantity: 2,
        totalPrice: 200,
        product: {
          productId: 1,
          userId: 1,
          categoryId: 1,
          name: 'Product',
          description: 'Product Description',
          price: 100,
          stock: 10,
          tag: 'Tag',
          imageUrl: 'image.jpg',
          isFeatured: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        owner: {
          userId: 1,
          name: 'User Name',
          email: 'user@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      (prisma.order.findUnique as jest.Mock).mockResolvedValue(order);

      const result = await service.findOne(orderId);
      expect(result).toEqual(order);
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { orderId },
        include: { product: true, owner: true },
      });
    });

    it('should throw NotFoundException if order not found', async () => {
      const orderId = 1;

      (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(orderId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an order successfully', async () => {
      const orderId = 1;
      const order = {
        orderId,
        productId: 1,
        quantity: 2,
        totalPrice: 200,
        product: {
          productId: 1,
          userId: 1,
          categoryId: 1,
          name: 'Product',
          description: 'Product Description',
          price: 100,
          stock: 10,
          tag: 'Tag',
          imageUrl: 'image.jpg',
          isFeatured: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        owner: {
          userId: 1,
          name: 'User Name',
          email: 'user@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(order as any); // Cast as any to simplify
      (prisma.product.update as jest.Mock).mockResolvedValue(order.product);
      (prisma.order.delete as jest.Mock).mockResolvedValue(order);

      const result = await service.remove(orderId);
      expect(result).toEqual(order);
      expect(service.findOne).toHaveBeenCalledWith(orderId);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { productId: order.product.productId },
        data: { stock: order.product.stock + order.quantity },
      });
      expect(prisma.order.delete).toHaveBeenCalledWith({ where: { orderId } });
    });

    it('should throw NotFoundException if order not found for removal', async () => {
      const orderId = 1;

      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.remove(orderId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOrderStatus', () => {
    it('should return order status successfully', async () => {
      const orderId = 1;
      const status = Status.PENDING;
      const order = { orderId, status };

      (prisma.order.findUnique as jest.Mock).mockResolvedValue(order);

      const result = await service.getOrderStatus(orderId);
      expect(result).toEqual(status);
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { orderId },
        select: { status: true },
      });
    });

    it('should throw NotFoundException if order not found', async () => {
      const orderId = 1;

      (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getOrderStatus(orderId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllForUser', () => {
    it('should return all orders for a user', async () => {
      const userId = 1;
      const orders = [
        {
          orderId: 1,
          productId: 1,
          quantity: 2,
          totalPrice: 200,
          product: {
            productId: 1,
            userId: 1,
            categoryId: 1,
            name: 'Product',
            description: 'Product Description',
            price: 100,
            stock: 10,
            tag: 'Tag',
            imageUrl: 'image.jpg',
            isFeatured: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ];

      (prisma.order.findMany as jest.Mock).mockResolvedValue(orders);

      const result = await service.findAllForUser(userId);
      expect(result).toEqual(orders);
      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { product: true },
      });
    });
  });

  describe('updateStatus', () => {
    //   it('should update the order status successfully', async () => {
    //     const orderId = 1;
    //     const status = Status.SHIPPED;
    //     const order = { orderId, status: Status.PENDING };

    //     jest.spyOn(service, 'findOne').mockResolvedValue(order as any);
    //     (prisma.order.update as jest.Mock).mockResolvedValue({
    //       ...order,
    //       status,
    //     });

    //     const result = await service.updateStatus(orderId, status);
    //     expect(result).toEqual({ ...order, status });
    //     expect(service.findOne).toHaveBeenCalledWith(orderId);
    //     expect(prisma.order.update).toHaveBeenCalledWith({
    //       where: { orderId },
    //       data: { status },
    //     });
    //   });

    it('should throw NotFoundException if order not found for status update', async () => {
      const orderId = 1;
      const status = Status.SHIPPED;

      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.updateStatus(orderId, status)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
