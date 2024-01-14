//user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MyConfigModule } from 'src/config/myconfig.module';
import { AuthService } from 'src/auth-42/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    MyConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
