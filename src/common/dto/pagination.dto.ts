import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Page size', example: 10 })
  pageSize?: number = 10;
}
