// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(userId: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { userId: userId },
    });
  }

  async update(userId: number, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { userId: userId },
      data,
    });
  }

  async remove(userId: number): Promise<User> {
    return this.prisma.user.delete({
      where: { userId: userId },
    });
  }
}
