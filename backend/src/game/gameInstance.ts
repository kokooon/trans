import { Server, Socket } from 'socket.io';
import { Ball } from './ball';

export class GameInstance {
  gameId: number;
  playerAPosition: { y: number };
  playerBPosition: { y: number };
  ball: Ball;
  intervalId: NodeJS.Timeout | null = null;

  constructor(gameId: number, playerAPosition: { y: number }, playerBPosition: { y: number }) {
    this.gameId = gameId;
    this.playerAPosition = playerAPosition;
    this.playerBPosition = playerBPosition;
    
    // Randomly decide the starting side of the ball
    const startSide = Math.random() < 0.5 ? 'A' : 'B';
    const ballStartPosition = {
      x: startSide === 'A' ? 35 : 765, // Adjusted for paddle width and game field
      y: startSide === 'A' ? playerAPosition.y + 50 : playerBPosition.y + 50,
    };
    const ballVelocity = {
      dx: startSide === 'A' ? 3 : -3, // Adjust velocity direction based on the side
      dy: 0, // Starts with horizontal movement; adjust as necessary
    };

    this.ball = new Ball(ballStartPosition.x, ballStartPosition.y, ballVelocity.dx, ballVelocity.dy);
  }

  async startGameLoop(playerA: string, playerB: string, server:Server) {
      this.intervalId = setInterval(() => {
        // Update game state
        this.ball.updatePosition(800, 500, this.playerAPosition, this.playerBPosition);

        // Emit game state to clients
        server.to(playerA).emit('gameState', { 
          playerAPosition: this.playerAPosition.y, 
          playerBPosition: this.playerBPosition.y,
          ballPosition: this.ball 
        });

        server.to(playerB).emit('gameState', { 
          playerAPosition: this.playerAPosition.y, 
          playerBPosition: this.playerBPosition.y,
          ballPosition: this.ball 
        });
        
        // Additional game logic...
      }, 1000 / 60); // 60 FPS
  }

  async stopGameLoop(gameId: number) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

}
