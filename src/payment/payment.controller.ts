import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { PaymentDto } from './dto';
import { GetUser, Roles } from 'src/auth/decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.BUYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate order payment' })
  @ApiResponse({
    status: 200,
    description: 'Payment initiated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async initiatePayment(
    @GetUser('userId') userId: number,
    @Body() initiatePaymentDto: PaymentDto,
  ) {
    const { orderId } = initiatePaymentDto;
    return this.paymentService.initiatePayment(orderId, userId);
  }

  @Get('callback')
  async handleCallback(@Query() query: any) {
    const { tx_ref } = query;
    const verificationResponse =
      await this.paymentService.verifyPayment(tx_ref);
    this.logger.log(
      `Payment verification response: ${JSON.stringify(verificationResponse)}`,
    );
    return verificationResponse;
  }
}
