import { ERMQueues } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OrderRepository } from './orders.repository';
import { Order } from './entities/order.entity';
import { EOrderStatus } from './enums/status.enum';

@Injectable()
export class OrdersService {

  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject(ERMQueues.PRODUCTS) private readonly productClient: ClientProxy
  ) { }

  getHello(): string {
    return 'Hello World! (ORDERS)';
  }

  async createOrder(body: Partial<Order>) {
    const order = await this.orderRepository.create(body);

    //MICRO :  Decrements the stock count for each product in the order
    const products = order.items.map(m => ({ productId: m.productId, quantity: m.quantity }));
    await this.productClient.emit("update_stock", products);

    return order;
  }

  async cancelOrder(orderId: string) {
    await this.orderRepository.updateOneById(orderId, { status: EOrderStatus.CANCELLED });

    //MICRO: Restores the stock for products in the canceled order.
    const order = await this.orderRepository.findOne({ where: { id: orderId }, relations: ['items'] });
    const products = order.items.map(m => ({ productId: m.productId, quantity: m.quantity }));
    await this.productClient.emit("restore_stock", products);

    return `Order with id=${orderId} has been cancelled`;
  }
}
