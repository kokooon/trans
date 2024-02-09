import { Component } from 'react';

interface CanvasTutorialProps {
  socket: any;
}

interface BallPosition {
  x: number;
  y: number;
}

interface CanvasTutorialState {
  playerAPosition: number;
  playerBPosition: number;
  ballPosition: BallPosition;
}

class CanvasTutorial extends Component<CanvasTutorialProps, CanvasTutorialState> {
  state: CanvasTutorialState = {
    playerAPosition: 200,
    playerBPosition: 200,
    ballPosition: { x: 400, y: 250 },
  };

  componentDidMount() {
    const { socket } = this.props;
    socket.on('game:created', this.handleGameCreated);
    socket.on('gameState', this.handleGameState);
    this.draw();
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.off('game:created', this.handleGameCreated);
    socket.off('gameState', this.handleGameState);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  handleGameState = (gameState: any) => {
    const { playerAPosition, playerBPosition, ballPosition } = gameState;
    this.setState({ playerAPosition, playerBPosition, ballPosition });
    this.draw(); // Redessiner le canvas avec les nouvelles positions
  };

  handleGameCreated = (gameData: any) => {
    // Mettre à jour les positions des joueurs et de la balle avec les données reçues
    const { playerA, playerB, ball } = gameData;
    this.setState({
      playerAPosition: playerA.y,
      playerBPosition: playerB.y,
      ballPosition: { x: ball.x, y: ball.y },
    });
  };

  draw() {
    const canvas = this.refs.canvas as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const height = 500;
    const width = 800;

    if (ctx)
    {
      const animate = () => {
        ctx.clearRect(0, 0, width, height); // Effacer le canvas
  
        ctx.strokeStyle = 'black';
        ctx.strokeRect(5, 5, width - 10, height - 10);
  
        // Dessiner le joueur A
        ctx.fillStyle = 'blue';
        ctx.fillRect(10, this.state.playerAPosition, 20, 100);
  
        // Dessiner le joueur B
        ctx.fillStyle = 'red';
        ctx.fillRect(width - 30, this.state.playerBPosition, 20, 100);
  
        // Dessiner la balle
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.state.ballPosition.x, this.state.ballPosition.y, 5, 0, 2 * Math.PI);
        ctx.fill();
  
        // Répéter l'animation
        requestAnimationFrame(animate);
      };

      animate();
    }
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      const { socket } = this.props;
      socket.emit('keydown', { key: 'ArrowUp' });
    } else if (event.key === 'ArrowDown') {
      const { socket } = this.props;
      socket.emit('keydown', { key: 'ArrowDown' });
    }
  }

  handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      const { socket } = this.props;
      socket.emit('keyup', { key: 'ArrowUp' });
    } else if (event.key === 'ArrowDown') {
      const { socket } = this.props;
      socket.emit('keyup', { key: 'ArrowDown' });
    }
  }

  render() {
    return (
      <div>
        <canvas ref="canvas" width={800} height={500}></canvas>
      </div>
    );
  }
}

export default CanvasTutorial;