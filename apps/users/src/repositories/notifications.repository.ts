import { Injectable, Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from '@app/common/database-mongo/abstract.repository';
import { Notification } from '../schemas/notification.schema';

@Injectable()
export class NotificationsRepository extends AbstractRepository<Notification> {
  readonly logger = new Logger(NotificationsRepository.name);
  constructor(
    @InjectModel(Notification.name)
    protected readonly notificationModel: Model<Notification>,
  ) {
    super(notificationModel);
  }

  async markNotificationsAsRead(
    notificationIds: Types.ObjectId[],
  ): Promise<void> {
    await this.notificationModel.updateMany(
      { _id: { $in: notificationIds } },
      { isRead: true },
    );
  }
}
