import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed_data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {

  }

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return {
      msg:"Data eliminada y cargadaa de forma exitosa"
    }
  }

  private async deleteTables() {

    await this.productsService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
    .delete()
    .where({})
    .execute()

  }

  private async insertUsers () {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user))
    });
    const dbUsers = await this.userRepository.save(seedUsers);
    return dbUsers[0];
  }

  private async insertNewProducts(user:User) {
    await this.productsService.deleteAllProducts();
    const products = initialData.products;

    const inserPromises = [];

    products.forEach(product => {
      inserPromises.push(this.productsService.create(product, user));
    });
    await Promise.all(inserPromises);

    return true;

  }
}
