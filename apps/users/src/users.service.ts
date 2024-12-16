import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
  ) { }

  getHello(): string {
    return 'Hello World! (USERS)';
  }

  create(data: Partial<User>) {
    return this.userRepository.create(data);
  }
}
