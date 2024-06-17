// src/order/dto/update-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateOrderDto {
  @ApiProperty({
    example: 2,
    description: 'The quantity of the product',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({
    example: 'SHIPPED',
    enum: Status,
    description: 'The status of the order',
    required: false,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
