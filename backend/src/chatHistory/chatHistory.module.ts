import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { chatHistoryService } from './chatHistory.service';
import { UserModule } from '../user/user.module';
import { chatHistory } from '../entities/chatHistory.entity';
import { MyConfigModule } from 'src/config/myconfig.module';
import { chatHistoryController } from './chatHistory.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([chatHistory]), // Import the TypeOrm feature module for ChatHistory
    MyConfigModule,
    UserModule, // Import the UserModule that exports UserService
  ],
  controllers: [chatHistoryController],
  providers: [chatHistoryService],
  exports: [chatHistoryService] // Export if you want to use this service in other modules
})
export class chatHistoryModule {}
