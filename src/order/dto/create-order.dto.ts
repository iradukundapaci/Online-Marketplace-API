// src/order/dto/create-order.dto.ts
import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @IsEnum(Status)
  status: Status;
}
