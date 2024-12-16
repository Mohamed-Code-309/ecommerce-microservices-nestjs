import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { Product } from './entities/product.entity';
import { IStockUpdate } from './dtos/stock-update';

@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly rmqService: RmqService
  ) { }

  @Get()
  getHello(): string {
    return this.productsService.getHello();
  }


  @Post()
  async create(@Body() productData: Partial<Product>): Promise<Product> {
    return this.productsService.create(productData);

  }
  @EventPattern("update_stock")
  async handleUpdateStock(@Payload() data: Array<IStockUpdate>, @Ctx() context: RmqContext) {
    await this.productsService.updateStock(data);
    this.rmqService.ack(context);
  }

  @EventPattern("restore_stock")
  async handleRestoreStock(@Payload() data: Array<IStockUpdate>, @Ctx() context: RmqContext) {
    await this.productsService.restoreStock(data);
    this.rmqService.ack(context);
  }

  @EventPattern("update_category_name")
  async updateCategoryName(@Payload() data: any, @Ctx() context: RmqContext) {
    await this.productsService.updateCategoryName(data);
    this.rmqService.ack(context);
  }
}
