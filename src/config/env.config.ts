import { registerAs } from '@nestjs/config';

const environment = process.env.NODE_ENV || 'dev';

export default registerAs('config', () => ({
  environment,
  port: +process.env.PORT,
  hostApi: process.env.HOST_API,
  database: {
    type: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: +process.env.DB_PORT,
    synchronize: environment !== 'production',
    autoLoadEntities: environment !== 'production',
  },
}));
