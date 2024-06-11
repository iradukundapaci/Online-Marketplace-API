import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, signupDto } from './dto';

@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }
  @Post('signup')
  signup(@Body() dto: signupDto) {
    return this.authService.signup(dto);
  }

  @Get('verify')
  async verify(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}

export { AuthController };
