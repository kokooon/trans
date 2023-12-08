// database.config.ts

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity'; 

const postgresConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User],
  synchronize: true,
  migrations: [__dirname + '/src/migration/**/*{.ts,.js}'],
};

export {postgresConfig};
