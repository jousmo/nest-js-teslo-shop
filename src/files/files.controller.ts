import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { fileFilter, filename } from './helpers';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:uuid')
  findProductImage(@Res() res: Response, @Param('uuid') uuid: string) {
    const path = this.filesService.findProductImage(uuid);
    return res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      storage: diskStorage({
        destination: './static/products',
        filename,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    const secureUrl = this.filesService.uploadProductImage(file);
    return { secureUrl };
  }
}
