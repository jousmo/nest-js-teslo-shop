import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import config from './config/env.config';

(async () => {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const configSwagger = new DocumentBuilder()
    .setTitle('Teslo API')
    .setDescription('Teslo shop endpoints')
    .setVersion('2.0')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/v2/docs', app, document);

  const configService: ConfigType<typeof config> = app.get(config.KEY);

  await app.listen(configService.port);
})();
