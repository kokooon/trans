// ./myconfig.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MyConfigController } from './myconfig.controller';
import { MyConfigService } from './myconfig.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
  controllers: [MyConfigController],
  providers: [MyConfigService],
  exports: [MyConfigService,]
})
export class MyConfigModule {}
