import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { MyConfigModule } from 'src/config/myconfig.module'
import { Game } from 'src/entities/game.entity';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';

@Module({
  imports: [
    UserModule, 
    MyConfigModule,
    TypeOrmModule.forFeature([Game]),
  ],
  providers: [GameGateway, GameService],
  exports: [GameService],
})
export class GameModule {}