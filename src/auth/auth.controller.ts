import { Body, Controller, Post, Get, Query, HttpCode } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';

@ApiTags('auth')
@Controller('auth')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiResponse({ status: 200, description: 'Successful login' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: SigninDto })
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Post('signup')
  @HttpCode(201)
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: SignupDto })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Get('verify')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify email' })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Verification token',
  })
  @ApiResponse({ status: 200, description: 'Email successfully verified' })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  async verify(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}

export { AuthController };
