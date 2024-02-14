import { GameInstance } from './gameInstance';
import { Game } from '../entities/game.entity';

export class GameData {
    game: Game;
    gameinstance: GameInstance;

    constructor(game: Game, gameinstance: GameInstance) {
      this.game = game;
      this.gameinstance = gameinstance;
    }
  };