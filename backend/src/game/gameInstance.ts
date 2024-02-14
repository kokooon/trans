import { Ball } from './ball';

export class GameInstance {
    gameId: number;
    playerAPosition: { y: number };
    playerBPosition: { y: number };
    ball: Ball;
    intervalId: NodeJS.Timeout | null = null;
  
    constructor(gameId: number, playerAPosition: { y: number }, playerBPosition: { y: number }, ball: Ball) {
      this.gameId = gameId;
      this.playerAPosition = playerAPosition;
      this.playerBPosition = playerBPosition;
      this.ball = ball;
    }
    startGameLoop() {
        this.intervalId = setInterval(() => {
          // Update ball position
          this.ball.updatePosition(800, 500); // Example dimensions, adjust as needed
    
          // Here, you can also check for collisions and update scores accordingly
    
          // Emit the updated game state to all clients in this game instance
          // This logic will be implemented in the GameGateway
        }, 1000 / 60); // 60 FPS
      }
    
      stopGameLoop() {
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
      }
    }
