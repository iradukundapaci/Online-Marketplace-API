// src/product/dto/update-product.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the user updating the product',
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the category the product belongs to',
  })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiProperty({
    example: 'Updated Product Name',
    description: 'The updated name of the product',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Updated Product Description',
    description: 'The updated description of the product',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 120,
    description: 'The updated price of the product',
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 60,
    description: 'The updated stock quantity of the product',
  })
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @ApiProperty({
    example: 'Electronics',
    description: 'The updated tag of the product',
  })
  @IsNotEmpty()
  @IsString()
  tag: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the product is featured',
  })
  @IsOptional()
  @IsBoolean()
  isFeatured: boolean;
}
