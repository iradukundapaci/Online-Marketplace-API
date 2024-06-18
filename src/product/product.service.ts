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

  async findAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [products, totalCount] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take,
      }),
      this.prisma.product.count(),
    ]);

    return {
      data: products,
      totalCount,
      page,
      pageSize,
    };
  }

  async findOne(productId: number) {
    return this.prisma.product.findUnique({
      where: { productId },
    });
  }

  async updateImageUrl(productId: number, imageUrl: string) {
    productId = Number(productId);
    return this.prisma.product.update({
      where: { productId: productId },
      data: { imageUrl },
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
