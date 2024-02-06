import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { MyConfigModule } from 'src/config/myconfig.module'
import { Game } from 'src/entities/game.entity';

@Module({
  imports: [
    UserModule, 
    MyConfigModule,
    TypeOrmModule.forFeature([Game]),
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}