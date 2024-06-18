import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        userId: 1,
        categoryId: 1,
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        stock: 50,
        tag: 'test',
        isFeatured: false,
      };

      jest.spyOn(prisma.product, 'create').mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);
      expect(result).toEqual(mockProduct);
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: createProductDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all products with pagination', async () => {
      const page = 1;
      const pageSize = 10;
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const products = [mockProduct];
      const totalCount = 1;

      jest
        .spyOn(prisma, '$transaction')
        .mockResolvedValue([products, totalCount]);

      const result = await service.findAll(page, pageSize);
      expect(result).toEqual({
        data: products,
        totalCount,
        page,
        pageSize,
      });
      expect(prisma.$transaction).toHaveBeenCalledWith([
        prisma.product.findMany({ skip, take }),
        prisma.product.count(),
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const id = 1;

      jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(mockProduct);

      const result = await service.findOne(id);
      expect(result).toEqual(mockProduct);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { productId: id },
      });
    });
  });

  describe('updateImageUrl', () => {
    it('should update the product imageUrl', async () => {
      const productId = 1;
      const imageUrl = 'http://example.com/new-image.png';

      const updatedProduct = { ...mockProduct, imageUrl };

      jest.spyOn(prisma.product, 'update').mockResolvedValue(updatedProduct);

      const result = await service.updateImageUrl(productId, imageUrl);
      expect(result).toEqual(updatedProduct);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { productId },
        data: { imageUrl },
      });
    });
  });

  describe('update', () => {
    it('should update a product by ID', async () => {
      const id = 1;
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        description: 'This is an updated test product',
        price: 120,
        stock: 60,
        tag: 'updated-test',
        isFeatured: true,
        userId: 1,
        categoryId: 1,
      };

      const updatedProduct = { ...mockProduct, ...updateProductDto };

      jest.spyOn(prisma.product, 'update').mockResolvedValue(updatedProduct);

      const result = await service.update(id, updateProductDto);
      expect(result).toEqual(updatedProduct);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { productId: id },
        data: updateProductDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a product by ID', async () => {
      const id = 1;

      jest.spyOn(prisma.product, 'delete').mockResolvedValue(undefined);

      const result = await service.remove(id);
      expect(result).toBeUndefined();
      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { productId: id },
      });
    });
  });
});
