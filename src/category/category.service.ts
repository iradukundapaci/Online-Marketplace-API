// src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async findOne(categoryId: number): Promise<Category> {
    return this.prisma.category.findUnique({
      where: { categoryId },
    });
  }

  async update(
    categoryId: number,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    return this.prisma.category.update({
      where: { categoryId },
      data,
    });
  }

  async remove(categoryId: number): Promise<Category> {
    return this.prisma.category.delete({
      where: { categoryId },
    });
  }
}
