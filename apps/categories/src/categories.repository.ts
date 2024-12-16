import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from '@app/common/database-mongo/abstract.repository';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoriesRepository extends AbstractRepository<Category> {
  readonly logger = new Logger(CategoriesRepository.name);
  constructor(
    @InjectModel(Category.name)
    protected readonly categoryModel: Model<Category>,
  ) {
    super(categoryModel);
  }
}
