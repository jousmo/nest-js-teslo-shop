import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto): Promise<Product[]> {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string): Promise<Product> {
    return this.productsService.findOne(term);
  }

  @Patch(':uuid')
  @Auth(ValidRoles.admin)
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(uuid, updateProductDto);
  }

  @Delete(':uuid')
  @Auth(ValidRoles.admin)
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.productsService.remove(uuid);
  }
}
