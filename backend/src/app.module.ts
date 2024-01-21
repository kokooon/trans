//app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { chatHistoryModule } from './chatHistory/chatHistory.module';
import { Auth42Module } from './auth-42/auth-42.module';
import { AuthController } from './auth-42/auth.controller';
import { DatabaseModule } from './database/database.module';
import { SocialGateway } from './socket.gateway';

@Module({
  imports: [DatabaseModule, UserModule, Auth42Module, ChannelModule, chatHistoryModule],
  controllers: [AppController, AuthController],
  providers: [AppService, SocialGateway],
})
export class AppModule {}
