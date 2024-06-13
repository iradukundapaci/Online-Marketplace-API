// src/users/dto/user.dto.ts
import { Role } from '@prisma/client';

export class UserDto {
  userId: number;
  names: string;
  email: string;
  role: Role;
  profilePicture?: string;
  address?: string;
  telephone?: string;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
