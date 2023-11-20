import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import postgresConfig from '../../ormconfig';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forRoot(postgresConfig), TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
