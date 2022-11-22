import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ProductsService } from '../products/products.service';
import { User } from '../auth/entities/user.entity';
import { initialData } from './data/seed';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async executeSeed() {
    await this.deleteTables();
    const { 0: userAdmin } = await this.insertUsers();
    await this.insertNewProducts(userAdmin);
    return `Seed Executed`;
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = seedUsers.map((user) =>
      this.userRepository.create({
        ...user,
        password: bcrypt.hashSync(user.password, 10),
      }),
    );

    await this.userRepository.save(users);

    return users;
  }

  private async insertNewProducts(userAdmin: User) {
    await this.productsService.deleteAllProducts();

    const insertPromises = initialData.products.map((product) =>
      this.productsService.create(product, userAdmin),
    );

    await Promise.any(insertPromises);

    return true;
  }
}
