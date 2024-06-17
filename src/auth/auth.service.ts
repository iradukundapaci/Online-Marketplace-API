import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailer: MailerService,
  ) {}

  async signup(user: SignupDto) {
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

      const token = this.generateToken(
        data.userId,
        data.email,
        data.role,
        '30m',
      );
      const verificationUrl = `http://localhost:3000/auth/verify?token=${token}`;

      await this.mailer.sendMail(
        data.email,
        'Verify your email',
        `Please verify your email by clicking here: ${verificationUrl}`,
      );
      return { message: 'Verification email sent' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
  async signin(user: SigninDto) {
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

      const valid: boolean = await argon.verify(data.password, user.password);

      if (!valid) {
        throw new ForbiddenException('Incorrect credentials');
      }

      if (data.isVerified === false) {
        throw new ForbiddenException('Please verify your email');
      }
      console.log(data.role);

      return this.generateToken(data.userId, data.email, data.role);
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(token: string) {
    try {
      const data = await this.jwt.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      const user = await this.prisma.user.update({
        where: {
          email: data.email,
        },
        data: {
          isVerified: true,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  generateToken(
    userId: number,
    email: string,
    role: string = 'BUYER',
    expiresIn: string = '15m',
  ) {
    const payload = {
      sub: userId,
      email,
      role,
    };
    return this.jwt.sign(payload, {
      expiresIn: expiresIn,
      secret: this.config.get('JWT_SECRET'),
    });
  }
}

export { AuthService };
