import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(categoryId: number) {
    return this.prisma.category.findUnique({
      where: { categoryId },
    });
  }

  async update(categoryId: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { categoryId },
      data: updateCategoryDto,
    });
  }

  async remove(categoryId: number) {
    return this.prisma.category.delete({
      where: { categoryId },
    });
  }
}
