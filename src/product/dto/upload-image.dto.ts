// src/product/dto/upload-image.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UploadImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  productId: number;
}
