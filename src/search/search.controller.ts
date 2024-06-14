import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('products')
  searchProducts(@Query('query') query: string) {
    return this.searchService.searchProducts(query);
  }

  @Get('category/:id')
  searchByCategory(@Param('id', ParseIntPipe) categoryId: number) {
    return this.searchService.searchByCategory(categoryId);
  }

  @Get('tag')
  searchByTag(@Query('tag') tag: string) {
    return this.searchService.searchByTag(tag);
  }
}
