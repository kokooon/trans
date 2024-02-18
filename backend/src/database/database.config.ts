import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity'; 
import { chatHistory } from '../entities/chatHistory.entity'; 
import { Channel } from '../entities/channel.entity'; 
import { Secret } from '../entities/secret.entity';
import { Game } from 'src/entities/game.entity';

const postgresConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, chatHistory, Channel, Secret, Game], // Include all entities here
  synchronize: true,
  migrations: [__dirname + '/src/migration/**/*{.ts,.js}'],
};

export {postgresConfig};
