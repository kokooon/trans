
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

    updatePosition(width: number, height: number) {
      // Update ball position based on velocity
      this.x += this.dx;
      this.y += this.dy;
  
      // Collision detection with top and bottom boundaries
      if (this.y <= 0 || this.y >= height) {
        this.dy = -this.dy; // Reflect the vertical velocity
      }
  }
}