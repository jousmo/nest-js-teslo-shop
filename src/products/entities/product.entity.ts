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
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text', { unique: true })
  title: string;

  @ApiProperty()
  @Column('int', { default: 0 })
  price: number;

  @ApiProperty()
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty()
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty()
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty()
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty()
  @Column('text')
  gender: string;

  @ApiProperty()
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
