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
import { OrderService } from './order.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
//import { Roles } from 'src/auth/decorator';
import { CreateOrderDto, UpdateOrderDto } from './dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  //@Roles('BUYER')
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  //@Roles('ADMIN')
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id', ParseIntPipe) orderId: number) {
    return this.orderService.findOne(orderId);
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  //@Roles('ADMIN', 'SELLER')
  update(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(orderId, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  //@Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) orderId: number) {
    return this.orderService.remove(orderId);
  }
}
