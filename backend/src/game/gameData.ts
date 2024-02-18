import { GameInstance } from './gameInstance';
import { Game } from '../entities/game.entity';
import { getSocketIdByUserId } from 'src/entities/socket.map';

export class GameData {
    game: Game;
    gameinstance: GameInstance;
    socketA: string;
    socketB: string;

    constructor(game: Game, gameinstance: GameInstance) {
      this.game = game;
      this.gameinstance = gameinstance;
      this.socketA = getSocketIdByUserId(game.userA);
      this.socketB = getSocketIdByUserId(game.userB);
    }
  };