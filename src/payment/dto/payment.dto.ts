import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaymentDto {
  @ApiProperty({ description: 'Order ID', example: '1' })
  @IsNotEmpty()
  @IsNumber()
  orderId: number;
}
