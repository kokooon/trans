import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { Message } from '../entities/message.entity';
import { MyConfigModule } from 'src/config/myconfig.module';
import { MessageController } from './message.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message]),
  MyConfigModule,
],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService] // Export if you want to use this service in other modules
})
export class MessageModule {}
