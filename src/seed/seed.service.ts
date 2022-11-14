import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async executeSeed() {
    await this.insertNewProducts();
    return `Seed Executed`;
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();

    const insertPromises = initialData.products.map((product) =>
      this.productsService.create(product),
    );

    await Promise.any(insertPromises);

    return true;
  }
}
