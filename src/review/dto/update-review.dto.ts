import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max, IsString } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the product being reviewed',
  })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({
    example: 4,
    description: 'The updated rating given to the product',
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 'Updated comment about the product',
    description: 'The updated comment about the product',
  })
  @IsNotEmpty()
  @IsString()
  comment: string;
}
