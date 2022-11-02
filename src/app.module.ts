import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JoiConfig } from './config/joi.config';
import config from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      validationSchema: JoiConfig,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
