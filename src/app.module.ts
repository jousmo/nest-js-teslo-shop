import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoiConfig } from './config/joi.config';
import config from './config/env.config';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      validationSchema: JoiConfig,
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { database } = configService;
        return Object.assign({ ...database });
      },
      inject: [config.KEY],
    }),
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
  ],
})
export class AppModule {}
