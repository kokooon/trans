import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import postgresConfig from '../../ormconfig'; // Assurez-vous d'ajuster le chemin en fonction de votre structure de fichiers
import { User } from '../entities/user.entity'; // Assurez-vous d'ajuster le chemin en fonction de votre structure de fichiers
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forRoot(postgresConfig), TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
