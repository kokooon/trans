// database.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig } from './database.config'; 

@Module({
  imports: [TypeOrmModule.forRoot(postgresConfig)],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
