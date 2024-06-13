// src/user/user.service.ts
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: CreateUserDto) {
    if (user == null) {
      return 'no user found';
    }
    try {
      user.password = await argon.hash(user.password);

      const data = await this.prisma.user.create({
        data: {
          ...user,
        },
      });
      return { data };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(userId: number) {
    return this.prisma.user.findUnique({
      where: { userId },
    });
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { userId },
      data: updateUserDto,
    });
  }

  async remove(userId: number) {
    return this.prisma.user.delete({
      where: { userId },
    });
  }
}
