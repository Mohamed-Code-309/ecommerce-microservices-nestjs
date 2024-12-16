import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common/database-mongo/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { UsersRepository } from './repositories/users.repository';
import { NotificationsRepository } from './repositories/notifications.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/users/.env'
    }),
    DatabaseModule.register(),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Notification.name, schema: NotificationSchema }
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, NotificationsRepository],
})
export class UsersModule {}
