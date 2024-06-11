import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [JwtModule.register({}), MailerModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailerService],
})
class AuthModule {}

export { AuthModule };
