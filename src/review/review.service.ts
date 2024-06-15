import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createReviewDto: CreateReviewDto) {
    const { productId, rating, comment } = createReviewDto;

    const hasOrdered = await this.prisma.order.findFirst({
      where: {
        userId,
        productId,
        status: 'COMPLETED',
      },
    });

    if (!hasOrdered) {
      throw new BadRequestException(
        'You can only review products you have purchased.',
      );
    }

    return this.prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
      },
    });
  }

  async findAll() {
    return this.prisma.review.findMany();
  }

  async findOne(reviewId: number) {
    return this.prisma.review.findUnique({
      where: { reviewId },
    });
  }

  async update(reviewId: number, updateReviewDto: UpdateReviewDto) {
    const { rating, comment } = updateReviewDto;

    return this.prisma.review.update({
      where: { reviewId },
      data: {
        rating,
        comment,
        // userId and productId should not be updated as relationships in this example
      },
    });
  }

  async remove(reviewId: number) {
    return this.prisma.review.delete({
      where: { reviewId },
    });
  }
}
