import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtGuard } from 'src/auth/guard';

@ApiTags('search')
@ApiBearerAuth()
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('products')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Search for products (All users)' })
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'Search query string',
  })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  searchProducts(@Query('query') query: string) {
    return this.searchService.searchProducts(query);
  }

  @Get('category/:id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Search products by category ID (All users)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Category ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  searchByCategory(@Param('id', ParseIntPipe) categoryId: number) {
    return this.searchService.searchByCategory(categoryId);
  }

  @Get('tag')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Search products by tag (All users)' })
  @ApiQuery({ name: 'tag', required: true, description: 'Tag string' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  searchByTag(@Query('tag') tag: string) {
    return this.searchService.searchByTag(tag);
  }
}
