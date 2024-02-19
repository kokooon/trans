import { Server, Socket } from 'socket.io';
import { Ball, BallUpdateResult } from './ball';

export class GameInstance {
  gameId: number;
  playerAPosition: { y: number };
  moveupA: boolean;
  movedownA: boolean;
  inertiaA: number;
  moveupB: boolean;
  movedownB: boolean;
  inertiaB: number;
  playerBPosition: { y: number };
  ball: Ball;
  intervalId: NodeJS.Timeout | null = null;

  constructor(gameId: number, playerAPosition: { y: number }, playerBPosition: { y: number }) {
    this.gameId = gameId;
    this.playerAPosition = playerAPosition;
    this.playerBPosition = playerBPosition;
    this.moveupA = false;
    this.movedownA = false;
    this.moveupB = false;
    this.movedownB = false;
    this.inertiaA = 0;
    this.inertiaB = 0;
    
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

    const angle = 30;
    const speed = 2;
    this.ball = new Ball(ballStartPosition.x, ballStartPosition.y, angle, speed); 
  }

  async startGameLoop(playerA: string, playerB: string, server: Server): Promise<BallUpdateResult> {
    return new Promise((resolve, reject) => {
        this.intervalId = setInterval(async () => {
            const updateResult = this.ball.updatePosition(800, 500, this.playerAPosition, this.playerBPosition);

            if (updateResult.ballMissed) {
                console.log(`Un joueur a perdu un point`);
                clearInterval(this.intervalId); // Arrête la boucle de jeu
                resolve(updateResult); // Renvoie le résultat de la mise à jour de la balle
            } else {
                this.movements();

                server.to(playerA).emit('gameState', {
                    playerAPosition: this.playerAPosition.y,
                    playerBPosition: this.playerBPosition.y,
                    ballPosition: this.ball,
                });

                server.to(playerB).emit('gameState', {
                    playerAPosition: this.playerAPosition.y,
                    playerBPosition: this.playerBPosition.y,
                    ballPosition: this.ball,
                });
            }
        }, 1000 / 100); // 100 FPS
    });
}

  
async movements() 
{
  const ymax = 390;
  const ymin = 10;

  const clamp = (y: number, _min: number, _max:number) => Math.max(Math.min(y, _max), _min);

  // Calculate inertia for player A
  if (this.moveupA) {
      this.inertiaA += 1;
  } else if (this.movedownA) {
      this.inertiaA -= 1;
  }
  if (this.moveupA === false && this.movedownA === false)
  {
    if (this.inertiaA < 0)
      this.inertiaA += 0.5;
      if (this.inertiaA > 0)
      this.inertiaA -= 0.5;
  }

  // Calculate inertia for player B (same logic as player A)
  if (this.moveupB) {
    this.inertiaB += 1;
  } else if (this.movedownB) {
    this.inertiaB -= 1;
  }
  if (this.moveupB === false && this.movedownB === false)
  {
  if (this.inertiaB < 0)
    this.inertiaB += 0.5;
    if (this.inertiaB > 0)
    this.inertiaB -= 0.5;
  }

  this.inertiaA = clamp(this.inertiaA, -10, 10);
  this.inertiaB = clamp(this.inertiaB, -10, 10);

  // Déplacer les joueurs en fonction de l'inertie
  this.playerAPosition.y = clamp(this.playerAPosition.y - this.inertiaA, ymin, ymax)
  this.playerBPosition.y = clamp(this.playerBPosition.y - this.inertiaB, ymin, ymax)

  return;
}

async stopGameLoop() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
  this.ball = null
}

}
