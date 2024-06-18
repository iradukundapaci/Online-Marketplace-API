import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { Admin, Buyer, GetUser, Roles } from '../auth/decorator';
import { Role, Status } from '@prisma/client';

@ApiTags('order')
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Buyer()
  @Get('history')
  @ApiOperation({
    summary: 'Get order history for the logged-in user (buyer only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Order history retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  getOrderHistory(@GetUser('userId') userId: number) {
    return this.orderService.findAllForUser(userId);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Buyer()
  @Post()
  @ApiOperation({ summary: 'Create a new order (buyer only)' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateOrderDto })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Admin()
  @Get()
  @ApiOperation({ summary: 'Get all orders (admin only)' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.orderService.findAll();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.BUYER)
  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID (admin and buyer only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Admin()
  @Patch(':id')
  @ApiOperation({ summary: 'Update an order by ID (admin only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: UpdateOrderDto })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Admin()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order by ID (admin only)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    type: Number,
  })
  @ApiResponse({ status: 204, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.BUYER)
  @Get(':id/status')
  @ApiOperation({
    summary: 'Get the status of an order by ID (admin and buyer only)',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Order status retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  getOrderStatus(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderStatus(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.BUYER)
  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update the status of an order by ID (admin and buyer only)',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ enum: Status })
  @HttpCode(HttpStatus.OK)
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: Status,
  ) {
    return this.orderService.updateStatus(id, status);
  }
}
