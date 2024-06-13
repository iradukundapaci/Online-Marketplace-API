import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findOne(productId: number): Promise<Product> {
    return this.prisma.product.findUnique({
      where: { productId },
    });
  }

  async update(
    productId: number,
    data: Prisma.ProductUpdateInput,
  ): Promise<Product> {
    return this.prisma.product.update({
      where: { productId },
      data,
    });
  }

  async remove(productId: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { productId },
    });
  }
}
