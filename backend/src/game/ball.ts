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
    playerAPosition: { y: number };
    playerBPosition: { y: number };
    ball: Ball;
  
    constructor(playerAPosition: { y: number }, playerBPosition: { y: number }, ball: Ball) {
      this.playerAPosition = playerAPosition;
      this.playerBPosition = playerBPosition;
      this.ball = ball;
    }
  }
  