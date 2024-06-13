// src/review/review.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
//import { Roles } from 'src/auth/decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  //@Roles('BUYER')
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  //@Roles('ADMIN')
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id', ParseIntPipe) reviewId: number) {
    return this.reviewService.findOne(reviewId);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  //@Roles('BUYER')
  update(
    @Param('id', ParseIntPipe) reviewId: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(reviewId, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  //@Roles('BUYER', 'ADMIN')
  remove(@Param('id', ParseIntPipe) reviewId: number) {
    return this.reviewService.remove(reviewId);
  }
}
