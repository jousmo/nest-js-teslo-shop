import {
  IsString,
  MinLength,
  IsInt,
  IsPositive,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  slug: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  stock: number;

  @IsArray()
  @IsString({ each: true })
  sizes: string[];

  @IsString()
  @IsEnum(['men', 'women', 'unisex', 'kid'])
  gender: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
