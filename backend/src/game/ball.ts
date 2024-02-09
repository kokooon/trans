import { Game } from "src/entities/game.entity";

export class Ball {
    x: number;
    y: number;
    dx: number; // Vitesse horizontale
    dy: number; // Vitesse verticale
  
    constructor(x: number, y: number, dx: number, dy: number) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
    }
  }
  
  export class GameInstance {
    gameId: number;
    playerAPosition: { y: number };
    playerBPosition: { y: number };
    ball: Ball;
  
    constructor(gameId: number, playerAPosition: { y: number }, playerBPosition: { y: number }, ball: Ball) {
      this.gameId = gameId;
      this.playerAPosition = playerAPosition;
      this.playerBPosition = playerBPosition;
      this.ball = ball;
    }
  }

  export class GameData {
    game: Game;
    gameinstance: GameInstance;

    constructor(game: Game, gameinstance: GameInstance) {
      this.game = game;
      this.gameinstance = gameinstance;
    }
  };