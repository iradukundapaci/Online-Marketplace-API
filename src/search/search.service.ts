import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchProducts(query: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tag: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  async searchByCategory(categoryId: number) {
    return this.prisma.product.findMany({
      where: { categoryId },
    });
  }

  async searchByTag(tag: string) {
    return this.prisma.product.findMany({
      where: { tag: { contains: tag, mode: 'insensitive' } },
    });
  }
}
