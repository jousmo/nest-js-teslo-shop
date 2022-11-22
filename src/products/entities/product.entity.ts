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

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;

  @Column('int', { default: 0 })
  price: number;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { unique: true })
  slug: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('text', { array: true })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  // One product have many images
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
