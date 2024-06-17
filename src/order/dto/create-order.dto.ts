// src/order/dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'The ID of the user' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 1, description: 'The ID of the product' })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 2, description: 'The quantity of the product' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
