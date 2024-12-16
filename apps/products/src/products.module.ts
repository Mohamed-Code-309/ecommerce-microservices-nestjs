import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ConfigModule } from '@nestjs/config';
import { ERMQueues, RmqModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DatabaseModule } from '@app/common/database-postgres/database.module';
import { ProductRepository } from './products.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/products/.env'
    }),
    RmqModule.register([{ name: ERMQueues.ORDERS }]),
    DatabaseModule.register({}),
    TypeOrmModule.forFeature([Product])

  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository],
})
export class ProductsModule { }
