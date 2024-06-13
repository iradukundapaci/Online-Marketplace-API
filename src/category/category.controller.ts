// src/category/category.controller.ts
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
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
//import { Roles } from 'src/auth/decorator';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  //@Roles('ADMIN')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoryService.findOne(categoryId);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  //@Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(categoryId, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  //@Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoryService.remove(categoryId);
  }
}
