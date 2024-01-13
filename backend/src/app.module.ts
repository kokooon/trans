//app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';
import { Auth42Module } from './auth-42/auth-42.module';
import { AuthController } from './auth-42/auth.controller';
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [DatabaseModule, UserModule, Auth42Module, ChannelModule, MessageModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
