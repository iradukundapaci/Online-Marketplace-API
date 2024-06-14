import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    const { userId, productId } = createReviewDto;

    const hasOrdered = await this.prisma.order.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (!hasOrdered) {
      throw new BadRequestException(
        'You can only review products you have purchased.',
      );
    }

    return this.prisma.review.create({
      data: createReviewDto,
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
    return this.prisma.review.update({
      where: { reviewId },
      data: updateReviewDto,
    });
  }

  async remove(reviewId: number) {
    return this.prisma.review.delete({
      where: { reviewId },
    });
  }
}
