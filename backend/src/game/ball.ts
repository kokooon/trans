const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;
const PADDLE_OFFSET_A = 10; // Distance from the left edge of the canvas to Player A's paddle
const PADDLE_OFFSET_B = 30; 


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

    updatePosition(width: number, height: number, playerAPos: { y: number }, playerBPos: { y: number }) {
      console.log(`Before Update: Position (${this.x}, ${this.y}), Velocity (${this.dx}, ${this.dy})`);

      // Update ball position
      this.x += this.dx;
      this.y += this.dy;
  
      console.log(`After Movement: Position (${this.x}, ${this.y}), Velocity (${this.dx}, ${this.dy})`);

      // Collision detection with top and bottom boundaries
      if (this.y <= 0 || this.y >= height) {
        this.dy = -this.dy;
        console.log(`Boundary Collision Detected - New Velocity: (${this.dx}, ${this.dy})`);
      }

      // Adjust the calculation for Player A's paddle collision
      if (this.x <= PADDLE_OFFSET_A + PADDLE_WIDTH && this.y >= playerAPos.y && this.y <= playerAPos.y + PADDLE_HEIGHT) {
        this.dx = Math.abs(this.dx);
        console.log(`Collision with Player A's paddle - New Velocity: (${this.dx}, ${this.dy})`);
      }

      // Adjust the calculation for Player B's paddle collision
      // Note: We need to calculate the x position of Player B's paddle's left edge
      const playerBLeftEdge = width - PADDLE_OFFSET_B - PADDLE_WIDTH;
      if (this.x >= playerBLeftEdge && this.y >= playerBPos.y && this.y <= playerBPos.y + PADDLE_HEIGHT) {
        this.dx = -Math.abs(this.dx);
        console.log(`Collision with Player B's paddle - New Velocity: (${this.dx}, ${this.dy})`);
      }

      console.log(`After Collision Detection: Position (${this.x}, ${this.y}), Velocity (${this.dx}, ${this.dy})`);
    }
}
