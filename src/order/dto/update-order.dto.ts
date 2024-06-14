import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
