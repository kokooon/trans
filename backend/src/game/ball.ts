//ball.ts
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;
const PADDLE_OFFSET_A = 10; // Distance from the left edge of the canvas to Player A's paddle
const PADDLE_OFFSET_B = 30; 

export interface BallUpdateResult {
  ballMissed: boolean;
  playerIdMissed?: number;
}

export class Ball {
    x: number;
    y: number;
    dx: number;
    dy: number;
    angle: number;
    speed: number;
  
    constructor(x: number, y: number, angle: number, speed: number) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.speed = speed;
      const angleInRadians = this.angle * (Math.PI / 180); // Convertir l'angle en radians
      this.dx = speed * Math.cos(angleInRadians); // Calculer la vitesse en x
      this.dy = -speed * Math.sin(angleInRadians); // Calculer la vitesse en y (négatif car l'axe y est inversé)
  }

  updatePosition(width: number, height: number, playerAPos: { y: number }, playerBPos: { y: number }): BallUpdateResult {
    // Mettez à jour la position de la balle
    this.x += this.dx;
    this.y += this.dy;

    // Gestion des collisions avec les limites supérieure et inférieure
    if (this.y <= 10 || this.y >= height - 10) {
        this.dy = -this.dy;
    }

    // Gestion des collisions avec les raquettes
    if (this.x <= 0) { // Si la balle passe derrière le joueur A
        return { ballMissed: true, playerIdMissed: 1 }; // Indique que la balle a été ratée par le joueur A
    } else if (this.x >= width) { // Si la balle passe derrière le joueur B
        return { ballMissed: true, playerIdMissed: 2 }; // Indique que la balle a été ratée par le joueur B
    }

    // Gestion des collisions avec les raquettes
    if (this.x <= PADDLE_OFFSET_A + PADDLE_WIDTH && this.y >= playerAPos.y && this.y <= playerAPos.y + PADDLE_HEIGHT) {
        // Calculez la position de collision relative sur la raquette A
        const relativeIntersectY = (playerAPos.y + (PADDLE_HEIGHT / 2)) - this.y;
        const normalizedRelativeIntersectionY = relativeIntersectY / (PADDLE_HEIGHT / 2);
        const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 3); // Angle de rebond maximal de 60 degrés
        this.dx = this.speed * Math.cos(bounceAngle);
        this.dy = this.speed * -Math.sin(bounceAngle);
    }

    const playerBLeftEdge = width - PADDLE_OFFSET_B - PADDLE_WIDTH;
    if (this.x >= playerBLeftEdge && this.y >= playerBPos.y && this.y <= playerBPos.y + PADDLE_HEIGHT) {
        // Calculez la position de collision relative sur la raquette B
        const relativeIntersectY = (playerBPos.y + (PADDLE_HEIGHT / 2)) - this.y;
        const normalizedRelativeIntersectionY = relativeIntersectY / (PADDLE_HEIGHT / 2);
        const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 3); // Angle de rebond maximal de 60 degrés
        this.dx = this.speed * -Math.cos(bounceAngle);
        this.dy = this.speed * -Math.sin(bounceAngle);
    }

    return { ballMissed: false }; // Indique que la balle n'a pas été ratée
}
}
