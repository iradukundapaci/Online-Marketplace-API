import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a category', async () => {
    const createCategoryDto = {
      name: 'Electronics',
      description: 'Category for electronic items',
    };
    const createdCategory = {
      categoryId: 1,
      ...createCategoryDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.category.create as jest.Mock).mockResolvedValue(createdCategory);

    const result = await service.create(createCategoryDto);
    expect(result).toEqual(createdCategory);
    expect(prisma.category.create).toHaveBeenCalledWith({
      data: createCategoryDto,
    });
  });

  it('should find all categories', async () => {
    const categories = [
      {
        categoryId: 1,
        name: 'Electronics',
        description: 'Category for electronic items',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        categoryId: 2,
        name: 'Books',
        description: 'Category for books',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.category.findMany as jest.Mock).mockResolvedValue(categories);

    const result = await service.findAll();
    expect(result).toEqual(categories);
    expect(prisma.category.findMany).toHaveBeenCalled();
  });

  it('should find one category', async () => {
    const categoryId = 1;
    const category = {
      categoryId,
      name: 'Electronics',
      description: 'Category for electronic items',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.category.findUnique as jest.Mock).mockResolvedValue(category);

    const result = await service.findOne(categoryId);
    expect(result).toEqual(category);
    expect(prisma.category.findUnique).toHaveBeenCalledWith({
      where: { categoryId },
    });
  });

  it('should update a category', async () => {
    const categoryId = 1;
    const updateCategoryDto = {
      name: 'Updated Electronics',
      description: 'Updated description',
    };
    const updatedCategory = {
      categoryId,
      ...updateCategoryDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.category.update as jest.Mock).mockResolvedValue(updatedCategory);

    const result = await service.update(categoryId, updateCategoryDto);
    expect(result).toEqual(updatedCategory);
    expect(prisma.category.update).toHaveBeenCalledWith({
      where: { categoryId },
      data: updateCategoryDto,
    });
  });

  it('should delete a category', async () => {
    const categoryId = 1;
    const deletedCategory = {
      categoryId,
      name: 'Electronics',
      description: 'Category for electronic items',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.category.delete as jest.Mock).mockResolvedValue(deletedCategory);

    const result = await service.remove(categoryId);
    expect(result).toEqual(deletedCategory);
    expect(prisma.category.delete).toHaveBeenCalledWith({
      where: { categoryId },
    });
  });
});
