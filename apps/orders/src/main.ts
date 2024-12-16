import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { ERMQueues, RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(ERMQueues.ORDERS));
  await app.startAllMicroservices();
  await app.listen(process.env.PORT);
}
bootstrap();
