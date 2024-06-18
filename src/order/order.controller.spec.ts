import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Role, Status } from '@prisma/client';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockProduct = {
    productId: 1,
    userId: 1,
    categoryId: 1,
    name: 'Test Product',
    description: 'This is a test product',
    price: 100,
    stock: 50,
    tag: 'test',
    imageUrl: 'http://example.com/image.png',
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOwner = {
    userId: 1,
    names: 'Test User',
    email: 'test@example.com',
    password: 'password',
    role: Role.BUYER,
    profilePicture: 'http://example.com/profile.png',
    Address: '123 Test Street',
    telephone: '1234567890',
    isBlocked: false,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrder = {
    orderId: 1,
    userId: 1,
    productId: 1,
    quantity: 2,
    totalPrice: 200,
    status: Status.PENDING,
    orderDate: new Date(),
    updatedAt: new Date(),
    owner: mockOwner,
    product: mockProduct,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            getOrderStatus: jest.fn(),
            updateStatus: jest.fn(),
            findAllForUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getOrderHistory', () => {
    it('should return order history for the logged-in user', async () => {
      const userId = 1;
      const expectedResult = [mockOrder];
      jest.spyOn(service, 'findAllForUser').mockResolvedValue(expectedResult);

      const result = await controller.getOrderHistory(userId);
      expect(result).toEqual(expectedResult);
      expect(service.findAllForUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        productId: 1,
        quantity: 2,
        userId: 1,
      };
      const expectedResult = {
        message: 'Order received and is being processed',
      };
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createOrderDto);
      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createOrderDto);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const expectedResult = [mockOrder];
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      const result = await controller.findAll();
      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single order by ID', async () => {
      const id = 1;
      const expectedResult = mockOrder;
      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);
      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    // it('should throw NotFoundException if order not found', async () => {
    //   const id = 1;
    //   jest.spyOn(service, 'findOne').mockResolvedValue(null);

    //   await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
    // });
  });

  describe('update', () => {
    it('should update an order by ID', async () => {
      const id = 1;
      const updateOrderDto: UpdateOrderDto = {
        quantity: 3,
      };
      const expectedResult = { ...mockOrder, quantity: 3, totalPrice: 300 };
      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateOrderDto);
      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(id, updateOrderDto);
    });
  });

  describe('remove', () => {
    it('should delete an order by ID', async () => {
      const id = 1;
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });

    // it('should throw NotFoundException if order not found for removal', async () => {
    //   const id = 1;
    //   jest.spyOn(service, 'remove').mockResolvedValue(null);

    //   await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
    // });
  });

  describe('getOrderStatus', () => {
    it('should return the status of an order by ID', async () => {
      const id = 1;
      const expectedResult = Status.PENDING;
      jest.spyOn(service, 'getOrderStatus').mockResolvedValue(expectedResult);

      const result = await controller.getOrderStatus(id);
      expect(result).toEqual(expectedResult);
      expect(service.getOrderStatus).toHaveBeenCalledWith(id);
    });

    // it('should throw NotFoundException if order not found', async () => {
    //   const id = 1;
    //   jest.spyOn(service, 'getOrderStatus').mockResolvedValue(null);

    //   await expect(controller.getOrderStatus(id)).rejects.toThrow(
    //     NotFoundException,
    //   );
    // });
  });

  describe('updateOrderStatus', () => {
    it('should update the status of an order by ID', async () => {
      const id = 1;
      const status = Status.COMPLETED;
      const expectedResult = { ...mockOrder, status };
      jest.spyOn(service, 'updateStatus').mockResolvedValue(expectedResult);

      const result = await controller.updateOrderStatus(id, status);
      expect(result).toEqual(expectedResult);
      expect(service.updateStatus).toHaveBeenCalledWith(id, status);
    });
  });
});
