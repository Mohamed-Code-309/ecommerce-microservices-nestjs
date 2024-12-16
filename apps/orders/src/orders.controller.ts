import { Body, Controller, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Get()
  getHello(): string {
    return this.ordersService.getHello();
  }

  @Post()
  @HttpCode(201)
  createOrder(@Body() body: Partial<Order>) {
    return this.ordersService.createOrder(body);
  }

  @Put(':id')
  cancelOrder(@Param("id") id: string) {
    return this.ordersService.cancelOrder(id);
  }

}
