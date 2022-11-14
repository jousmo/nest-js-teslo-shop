import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const newImages = images.map((image) =>
        this.productImageRepository.create({ url: image }),
      );
      const product = await this.productRepository.create({
        ...productDetails,
        images: newImages,
      });
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto): Promise<Product[]> {
    const { limit: take = 10, offset: skip = 0 } = paginationDto;
    return this.productRepository.find({
      take,
      skip,
      // is not requires, use eager in entity
      relations: {
        images: true,
      },
    });
  }

  async findOne(term: string): Promise<Product> {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('title =:title OR slug =:slug', {
          title: term,
          slug: term,
        })
        .leftJoinAndSelect('product.images', 'productImages')
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product ${term} not found`);
    }

    return product;
  }

  async update(
    uuid: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.findOne(uuid);

      const { images, ...toUpdateProduct } = updateProductDto;

      const product: Product = await this.productRepository.preload({
        id: uuid,
        ...toUpdateProduct,
      });

      if (images) {
        await queryRunner.manager.delete(ProductImage, {
          product: { id: uuid },
        });

        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.productRepository.findOneBy({ id: uuid });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(uuid: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: uuid },
    });
    return this.productRepository.remove(product);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException();
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    return query.delete().where({}).execute();
  }
}
