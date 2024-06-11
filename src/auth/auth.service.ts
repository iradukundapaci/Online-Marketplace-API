import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(user: AuthDto) {
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
      delete data.password;
      return data;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
  async signin(user: AuthDto) {
    if (user == null) {
      return 'no user found';
    }
    try {
      const data = await this.prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
      if (data == null) {
        throw new ForbiddenException('Incorrect credentials');
      }

      const valid = await argon.verify(data.password, user.password);
      if (!valid) {
        throw new ForbiddenException('Incorrect credentials');
      }
      delete data.password;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async generateToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };
    return {
      access_token: await this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      }),
    };
  }
}

export { AuthService };
