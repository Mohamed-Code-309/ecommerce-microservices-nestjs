import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule } from '@nestjs/config';
import { ERMQueues, RmqModule } from '@app/common';
import { DatabaseModule } from '@app/common/database-postgres/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderRepository } from './orders.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/orders/.env'
    }),
    RmqModule.register([{ name: ERMQueues.PRODUCTS }]),
    DatabaseModule.register({}),
    TypeOrmModule.forFeature([Order, OrderItem])
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository],
})
export class OrdersModule { }
