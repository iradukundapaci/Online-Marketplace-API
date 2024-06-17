// src/users/dto/update-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
  @IsString()
  names: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'strongPassword123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: Role,
    example: Role.BUYER,
  })
  @IsEnum(Role)
  role: Role;

  @ApiPropertyOptional({
    description: 'The profile picture URL of the user',
    example: 'http://example.com/picture.jpg',
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiPropertyOptional({
    description: 'The address of the user',
    example: '123 Main St',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'The telephone number of the user',
    example: '123-456-7890',
  })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiPropertyOptional({
    description: 'The block status of the user',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @ApiPropertyOptional({
    description: 'The verification status of the user',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
