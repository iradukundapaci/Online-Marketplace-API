// src/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async findOne(productId: number) {
    return this.prisma.product.findUnique({
      where: { productId },
    });
  }

  async update(productId: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { productId },
      data: updateProductDto,
    });
  }

  async remove(productId: number) {
    return this.prisma.product.delete({
      where: { productId },
    });
  }
}
