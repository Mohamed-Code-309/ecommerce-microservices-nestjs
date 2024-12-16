import { Injectable, OnModuleInit } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductRepository } from './products.repository';
import * as fs from 'fs';
import * as path from 'path';
import { IStockUpdate } from './dtos/stock-update';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    private readonly productRepository: ProductRepository,
  ) { }

  async onModuleInit() {
    await this.seedProducts()
  }

  getHello(): string {
    return 'Hello World! (PRODUCTS)';
  }

  async updateStock(data: Array<IStockUpdate>) {
    console.log("From [Orders] Service to [Products] Service", data);
    for (const product of data) {
      const currentProduct = await this.productRepository.findOneById(product.productId);
      if (currentProduct) {
        const updatedStock = currentProduct.stock - product.quantity;
        await this.productRepository.updateOneById(product.productId, { stock: updatedStock })
      }
    }
  }


  async restoreStock(data: Array<IStockUpdate>) {
    console.log("From [Orders] Service to [Products] Service", data);
    for (const product of data) {
      const currentProduct = await this.productRepository.findOneById(product.productId);
      if (currentProduct) {
        const updatedStock = currentProduct.stock + product.quantity;
        await this.productRepository.updateOneById(product.productId, { stock: updatedStock })
      }
    }
  }


  async updateCategoryName(data: { oldName: string, newName: string }) {
    console.log("From [Category] Service to [Product] Service", data);
    const { oldName, newName } = data;
    await this.productRepository.updateMany({ category: oldName }, { category: newName });
  }

  create(data: Partial<Product>) {
    return this.productRepository.create(data);
  }


  async seedProducts() {
    //[1] delete existing products
    await this.productRepository.deleteMany({});
    //[2] read products from json file
    const filePath = path.join(process.cwd(), 'apps/products/src/data/products.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(fileData);
    //[3] insert products
    for (const product of products) {
      await this.productRepository.create(product);
    }
  }

}
