// src/product/dto/create-product.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @IsNotEmpty()
  @IsString()
  tag: string;

  @IsBoolean()
  isFeatured: boolean;
}
