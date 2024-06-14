// src/order/order.controller.ts
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
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { Status } from '@prisma/client';
// import { Roles } from 'src/auth/decorator';
// import { Role } from '@prisma/client';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtGuard)
  @Get('history')
  getOrderHistory(@GetUser('userId') userId: number) {
    return this.orderService.findAllForUser(userId);
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  //@Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }

  @UseGuards(JwtGuard)
  @Get(':id/status')
  getOrderStatus(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderStatus(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/status')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: Status,
  ) {
    return this.orderService.updateStatus(id, status);
  }
}
