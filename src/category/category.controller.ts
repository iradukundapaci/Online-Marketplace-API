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
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
// import { Roles } from 'src/auth/decorator';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  // @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateCategoryDto })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Category ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoryService.findOne(categoryId);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  // @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Category ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: UpdateCategoryDto })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(categoryId, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  // @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Category ID',
    type: Number,
  })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoryService.remove(categoryId);
  }
}
