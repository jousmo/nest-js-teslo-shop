import { existsSync } from 'fs';
import { join } from 'path';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from '../config/env.config';

@Injectable()
export class FilesService {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {}

  findProductImage(uuid: string) {
    const path = join(__dirname, '../../static/products/', uuid);
    if (!existsSync(path)) {
      throw new BadRequestException('No product image found');
    }

    return path;
  }

  uploadProductImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Make sure that file is an image');

    return `${this.configService.hostApi}/files/product/${file.filename}`;
  }
}
