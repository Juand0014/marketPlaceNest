import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { Repository } from 'typeorm';


@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository( User )
    private readonly userRepository: Repository<User>
    ) {}

  async runSeed() {
    await this.deleteTable();
    const adminUser = await this.inserUsers()
    await this.insertNewProducts(adminUser);
    return "SEED EXEECUTED"
  }

  private async deleteTable () {

    await this.productsService.deleteAllProducts()

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute()
  }

  private async inserUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(user => {
      users.push( this.userRepository.create( user ))
    });

    const dbUser = await this.userRepository.save( seedUsers )

    return dbUser[0];
  }

  private async insertNewProducts(user: User){
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push( this.productsService.create(product, user) );
    });

    const results = await Promise.all(insertPromises);

    return results;
  }

}
