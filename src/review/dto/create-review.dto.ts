import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the product being reviewed',
  })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({
    example: 4,
    description: 'The rating given to the product',
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 'Great product!',
    description: 'The comment about the product',
  })
  @IsNotEmpty()
  @IsString()
  comment: string;
}
