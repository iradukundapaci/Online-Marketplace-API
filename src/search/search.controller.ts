import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('products')
  @ApiOperation({ summary: 'Search for products' })
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'Search query string',
  })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(HttpStatus.OK)
  searchProducts(@Query('query') query: string) {
    return this.searchService.searchProducts(query);
  }

  @Get('category/:id')
  @ApiOperation({ summary: 'Search products by category ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Category ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(HttpStatus.OK)
  searchByCategory(@Param('id', ParseIntPipe) categoryId: number) {
    return this.searchService.searchByCategory(categoryId);
  }

  @Get('tag')
  @ApiOperation({ summary: 'Search products by tag' })
  @ApiQuery({ name: 'tag', required: true, description: 'Tag string' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(HttpStatus.OK)
  searchByTag(@Query('tag') tag: string) {
    return this.searchService.searchByTag(tag);
  }
}
