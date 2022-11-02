import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JoiConfig } from './config/joi.config';
import config from './config/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      validationSchema: JoiConfig,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { database } = configService;
        return Object.assign({ ...database });
      },
      inject: [config.KEY],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
