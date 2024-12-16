import { Body, Controller, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './schemas/category.schema';

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  getHello(): string {
    return this.categoriesService.getHello();
  }

  @Post()
  @HttpCode(201)
  createCategory(@Body() body: Partial<Category>) {
    return this.categoriesService.create(body);
  }

  @Put()
  updateCategoryName(@Body() body: { id: string, name: string }) {
    return this.categoriesService.updateCategoryName(body);
  }

}
