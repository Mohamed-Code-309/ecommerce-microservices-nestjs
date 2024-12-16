import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from '@app/common/database-mongo/abstract.repository';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  readonly logger = new Logger(UsersRepository.name);
  constructor(
    @InjectModel(User.name)
    protected readonly userModel: Model<User>,
  ) {
    super(userModel);
  }
}
