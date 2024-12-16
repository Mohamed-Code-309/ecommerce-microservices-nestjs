import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { ERMQueues, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(ERMQueues.PRODUCTS));
  await app.startAllMicroservices();
  await app.listen(process.env.PORT);
}
bootstrap();
