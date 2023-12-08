// database.config.ts

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const postgresConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/src/entities/**/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: [__dirname + '/src/migration/**/*{.ts,.js}'],
};

export {postgresConfig};
