// src/product/dto/create-product.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the user creating the product',
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
    example: 'Product Name',
    description: 'The name of the product',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Product Description',
    description: 'The description of the product',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 100, description: 'The price of the product' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 50,
    description: 'The stock quantity of the product',
  })
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @ApiProperty({
    example: 'Electronics',
    description: 'The tag of the product',
  })
  @IsNotEmpty()
  @IsString()
  tag: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the product is featured',
  })
  @IsOptional()
  @IsBoolean()
  isFeatured: boolean;

  @ApiPropertyOptional({
    example: 'https://example.com/image.png',
    description: 'The URL of the product image',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
