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
} from '@nestjs/common';
import { ProductService } from './product.service';

import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { CreateProductDto, UpdateProductDto } from './dto';
//import { Admin, Roles } from 'src/auth/decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  //  @Roles('SELLER')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.findOne(productId);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  //  @Roles('SELLER')
  update(
    @Param('id', ParseIntPipe) productId: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(productId, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  //  @Roles('SELLER')
  remove(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.remove(productId);
  }
}
