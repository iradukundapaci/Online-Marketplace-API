import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MinioService } from '../minio/minio.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;
  let minioService: MinioService;

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
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            updateImageUrl: jest.fn(),
          },
        },
        {
          provide: MinioService,
          useValue: {
            uploadFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
    minioService = module.get<MinioService>(MinioService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(minioService).toBeDefined();
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

      jest.spyOn(service, 'create').mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);
      expect(result).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('uploadImage', () => {
    it('should upload an image and update the product imageUrl', async () => {
      const file = {
        originalname: 'test.png',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      const productId = 1;
      const imageUrl = 'http://example.com/image.png';

      jest.spyOn(minioService, 'uploadFile').mockResolvedValue(imageUrl);
      jest
        .spyOn(service, 'updateImageUrl')
        .mockResolvedValue({ ...mockProduct, imageUrl });

      const result = await controller.uploadImage(file, productId);
      expect(result).toEqual({ imageUrl });
      expect(minioService.uploadFile).toHaveBeenCalledWith(file);
      expect(service.updateImageUrl).toHaveBeenCalledWith(productId, imageUrl);
    });
  });

  describe('findAll', () => {
    it('should return all products with pagination', async () => {
      const paginationDto: PaginationDto = { page: 1, pageSize: 10 };
      const expectedResult = {
        data: [mockProduct],
        totalCount: 1,
        page: 1,
        pageSize: 10,
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      const result = await controller.findAll(paginationDto);
      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const id = 1;
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct);

      const result = await controller.findOne(id);
      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith(id);
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

      jest.spyOn(service, 'update').mockResolvedValue(updatedProduct);

      const result = await controller.update(id, updateProductDto);
      expect(result).toEqual(updatedProduct);
      expect(service.update).toHaveBeenCalledWith(id, updateProductDto);
    });
  });

  describe('remove', () => {
    it('should delete a product by ID', async () => {
      const id = 1;
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
