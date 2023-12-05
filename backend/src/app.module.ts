//app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { Auth42Module } from './auth-42/auth-42.module';
import { AuthController } from './auth-42/auth.controller';

@Module({
  imports: [UserModule, Auth42Module],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
