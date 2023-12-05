import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const postgresConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'pong-database',
    port: 5432,
    username: 'root',
    password: 'root',
    database: 'pong',
    entities: [__dirname + '/src/entities/**/*.entity{.ts,.js}'],
    synchronize: true,
    migrations: [__dirname + '/src/migration/**/*{.ts,.js}'],
  };

export default postgresConfig;