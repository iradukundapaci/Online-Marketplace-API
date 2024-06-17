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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateReviewDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser('userId') userId: number,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.create(userId, createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Review ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Review retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) reviewId: number) {
    return this.reviewService.findOne(reviewId);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Update a review by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Review ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: UpdateReviewDto })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) reviewId: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(reviewId, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Delete a review by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Review ID',
    type: Number,
  })
  @ApiResponse({ status: 204, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) reviewId: number) {
    return this.reviewService.remove(reviewId);
  }
}
