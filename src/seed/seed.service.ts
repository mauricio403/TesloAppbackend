import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed_data';


@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService
  ) {

  }

  async runSeed() {
    await this.insertNewProducts();
    return {
      msg:"Data eliminada y cargadaa de forma exitosa"
    }
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();
    const products = initialData.products;

    const inserPromises = [];

    products.forEach(product => {
      inserPromises.push(this.productsService.create(product));
    });
    await Promise.all(inserPromises);

    return true;

  }
}
