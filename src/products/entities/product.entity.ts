import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: 'f20ee611-1d95-4519-a84f-737dfd3b1502',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product Title',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product Price',
  })
  @Column('int', { default: 0 })
  price: number;

  @ApiProperty({
    example: 'Lorem lorem',
    description: 'Product description',
    default: null,
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    example: 't_shirt_teslo',
    description: 'Product Slug',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product Stock',
    default: 0,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Product Sizes',
  })
  @ApiProperty()
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product Gender',
  })
  @ApiProperty()
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['TAG1', 'TAG2', 'TAG3'],
    description: 'Product Tags',
  })
  @Column('text', { array: true, default: [] })
  tags: string[];

  // One product have many images
  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true, // Load all relationship with use find*
  })
  images?: ProductImage[];

  // Many products have one user
  @ManyToOne(() => User, (user) => user.products, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replace("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.checkSlugInsert();
  }
}
