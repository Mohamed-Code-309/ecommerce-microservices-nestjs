import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { Category } from './schemas/category.schema';
import { ClientProxy } from '@nestjs/microservices';
import { ERMQueues } from '@app/common';

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(
    private readonly categoryRepository: CategoriesRepository,
    @Inject(ERMQueues.PRODUCTS) private readonly productClient: ClientProxy
  ) { }

  async onModuleInit() {
    await this.seedCategories()
  }

  getHello(): string {
    return 'Hello World! (CATEGORIES)';
  }

  create(data: Partial<Category>) {
    return this.categoryRepository.create(data);
  }

  async updateCategoryName(body: { id: string, name: string }) {
    const { id, name } = body;
    const category = await this.categoryRepository.findOneById(id);
    if (category) {
      const updateCategory = await this.categoryRepository.updateOneById(id, { name });
      console.log(updateCategory);
      //MICRO: update catgeory name will trigger change in catgeory field in product micorservice
      await this.productClient.emit("update_category_name", { oldName: category.name, newName: name });
      return updateCategory;
    }
  }

  async seedCategories() {
    await this.categoryRepository.deleteMany({});
    const category = {
      "name": "Electronics",
      "description": "Devices and gadgets",
      "parent_category_id": null,
      "image_url": "http://example.com/images/electronics.jpg",
      "slug": "electronics"
    }
    await this.categoryRepository.create(category);
  }

}
