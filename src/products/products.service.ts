import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    });
  }

  async findOne(term: string): Promise<Product> {
    const queryBuilder = this.productRepository.createQueryBuilder();
    const product: Product = await queryBuilder
      .where('id =:uuid OR title =:title OR slug =:slug', {
        uuid: isUUID(term) ? term : undefined,
        title: term,
        slug: term,
      })
      .getOne();

    if (!product) {
      throw new NotFoundException(`Product ${term} not found`);
    }

    return product;
  }

  async update(
    uuid: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      await this.findOne(uuid);

      const product: Product = await this.productRepository.preload({
        id: uuid,
        ...updateProductDto,
        images: [],
      });

      return this.productRepository.save(product);
    } catch (error) {
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
}
