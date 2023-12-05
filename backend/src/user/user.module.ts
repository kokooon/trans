import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import postgresConfig from '../../ormconfig';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MyConfigModule } from '../config/myconfig.module';
import { InjectRepository } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(postgresConfig), 
    TypeOrmModule.forFeature([User]), 
    MyConfigModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
