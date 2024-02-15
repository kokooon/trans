import { Component } from 'react';

const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;
const PADDLE_OFFSET_A = 10;
const PADDLE_OFFSET_B = 30;

interface CanvasTutorialProps {
  socket: any;
  gameId: number;
}

interface BallPosition {
  x: number;
  y: number;
}

interface CanvasTutorialState {
  playerAPosition: number;
  playerBPosition: number;
  ballPosition: BallPosition;
  gameId?: number;
}

class CanvasTutorial extends Component<CanvasTutorialProps, CanvasTutorialState> {
  constructor(props: CanvasTutorialProps) {
    super(props);
    this.state = {
      playerAPosition: 200,
      playerBPosition: 200,
      ballPosition: { x: 400, y: 250 },
      // Initialize other state properties as needed
    };
  }

  componentDidMount() {
    const { socket, gameId } = this.props;
    gameId;
    socket.on('game:created', this.handleGameCreated);
    socket.on('gameState', this.handleGameState);
    this.draw();
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    const { socket, gameId } = this.props;
    if (gameId) {
      socket.emit('stopGameLoop', { gameId });
    }
    socket.off('game:created', this.handleGameCreated);
    socket.off('gameState', this.handleGameState);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    // Removed the redundant emit using this.state.gameId
    console.log('Component is unmounting, gameId:', gameId);
  }
  
  

  handleGameState = (gameState: any) => {
    const { playerAPosition, playerBPosition, ballPosition } = gameState;
    this.setState({ playerAPosition, playerBPosition, ballPosition });
    console.log('ball pos = ', ballPosition);
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
        ctx.clearRect(0, 0, width, height);
  
        ctx.strokeStyle = 'black';
        ctx.strokeRect(5, 5, width - 10, height - 10);
  
        // Dessiner le joueur A
        ctx.fillStyle = 'blue';
        ctx.fillRect(PADDLE_OFFSET_A, this.state.playerAPosition, PADDLE_WIDTH, PADDLE_HEIGHT);
  
        // Dessiner le joueur B
        ctx.fillStyle = 'red';
        ctx.fillRect(width - PADDLE_OFFSET_B, this.state.playerBPosition, PADDLE_WIDTH, PADDLE_HEIGHT);

  
        // Dessiner la balle
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.state.ballPosition.x, this.state.ballPosition.y, 5, 0, 2 * Math.PI);
        ctx.fill();
  
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