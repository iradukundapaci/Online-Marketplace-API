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
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { Status } from '@prisma/client';
// import { Roles } from 'src/auth/decorator';
// import { Role } from '@prisma/client';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtGuard)
  @Get('history')
  @ApiOperation({ summary: 'Get order history for the logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'Order history retrieved successfully',
  })
  @HttpCode(HttpStatus.OK)
  getOrderHistory(@GetUser('userId') userId: number) {
    return this.orderService.findAllForUser(userId);
  }

  @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: CreateOrderDto })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.orderService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an order by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: UpdateOrderDto })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    type: Number,
  })
  @ApiResponse({ status: 204, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }

  @UseGuards(JwtGuard)
  @Get(':id/status')
  @ApiOperation({ summary: 'Get the status of an order by ID' })
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
  @HttpCode(HttpStatus.OK)
  getOrderStatus(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderStatus(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the status of an order by ID' })
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
  @ApiBody({ enum: Status })
  @HttpCode(HttpStatus.OK)
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: Status,
  ) {
    return this.orderService.updateStatus(id, status);
  }
}
