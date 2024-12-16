import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common/database-mongo/database.module';
import { Category, CategorySchema } from './schemas/category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesRepository } from './categories.repository';
import { ERMQueues, RmqModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/categories/.env'
    }),
    RmqModule.register([{ name: ERMQueues.PRODUCTS }]),
    DatabaseModule.register(),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
