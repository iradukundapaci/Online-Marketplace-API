import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(userId: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { userId },
    });
  }

  async update(userId: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { userId },
      data,
    });
  }

  async remove(userId: number): Promise<User> {
    return this.prisma.user.delete({
      where: { userId },
    });
  }
}
