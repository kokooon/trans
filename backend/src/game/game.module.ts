// game.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module'; // Ensure the path is correct
import { MyConfigModule } from 'src/config/myconfig.module';
import { Game } from 'src/entities/game.entity';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';

@Module({
  imports: [
    MyConfigModule,
    TypeOrmModule.forFeature([Game]),
    UserModule, // Import UserModule here
  ],
  controllers: [GameController],
  providers: [GameService, GameGateway], // UserService is no longer directly provided here
  exports: [GameService],
})
export class GameModule {}