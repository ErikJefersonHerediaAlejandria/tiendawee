import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { StoreService } from './store.service';
import type { CreateOrderInput } from './store.service';

@Controller()
export class StoreController {
  constructor(private readonly store: StoreService) {}

  @Get('plans')
  plans() {
    return this.store.listPlans();
  }

  @Post('orders')
  createOrder(@Body() body: CreateOrderInput) {
    return this.store.createOrder(body);
  }

  @Get('orders/:id')
  getOrder(@Param('id', ParseIntPipe) id: number) {
    return this.store.getOrder(id);
  }
}
