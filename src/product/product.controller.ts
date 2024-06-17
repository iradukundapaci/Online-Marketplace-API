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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Roles, Seller } from 'src/auth/decorator';
import { Role } from '@prisma/client';

@ApiTags('product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Seller()
  @ApiOperation({ summary: 'Create a new product (seller only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({ type: CreateProductDto })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Seller()
  @ApiOperation({ summary: 'Get all products (seller only)' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.productService.findAll();
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
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.remove(productId);
  }
}
