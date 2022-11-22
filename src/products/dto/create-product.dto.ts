import {
  IsString,
  MinLength,
  IsInt,
  IsPositive,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title (unique)',
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @IsPositive()
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(1)
  slug: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @IsPositive()
  stock: number;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  sizes: string[];

  @ApiProperty()
  @IsString()
  @IsEnum(['men', 'women', 'unisex', 'kid'])
  gender: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
