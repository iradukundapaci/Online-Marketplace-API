// src/product/product.controller.ts
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
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Roles, Seller } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MinioService } from 'src/minio/minio.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Seller()
  @ApiOperation({ summary: 'Create a new product (seller only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      const imageUrl = await this.minioService.uploadFile(image);
      createProductDto.imageUrl = imageUrl;
    }
    return this.productService.create(createProductDto);
  }

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Seller()
  @ApiOperation({ summary: 'Get all products with pagination (seller only)' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  findAll(@Query() paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    return this.productService.findAll(page, pageSize);
  }

  //Add get all product for seller

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get a product by ID (available for all users)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.findOne(productId);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SELLER)
  @ApiOperation({ summary: 'Update a product by ID (seller, admins only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: UpdateProductDto })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) productId: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(productId, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SELLER)
  @ApiOperation({ summary: 'Delete a product by ID (seller, admins only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product ID',
    type: Number,
  })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.remove(productId);
  }
}
