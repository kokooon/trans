import { WebSocketGateway, OnGatewayConnection, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { getUserIdBySocketId } from 'src/entities/socket.map';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private matchmakingQueue: string[] = [];

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Le gamegateway ecoute:', client.id);
  }

  @SubscribeMessage('matchmaking:request')
  async handleMatchmaking(client: Socket): Promise<void> {
    console.log('Matchmaking request received from', client.id);
    
    // Check if the player is already in the matchmaking queue
    if (this.matchmakingQueue.includes(client.id)) {
      console.log('Player is already in the matchmaking queue.');
      return; // Exit early if the player is already in the queue
    }
  
    // Add player to the matchmaking queue
    this.matchmakingQueue.push(client.id);
    console.log(this.matchmakingQueue);
    // Check if there are at least two players in the queue
    if (this.matchmakingQueue.length >= 2) {
      // Pair the first two players in the queue
      const [playerOne, playerTwo] = this.matchmakingQueue.splice(0, 2);
      
      // Notify both players that a match has been found
      this.server.to(playerOne).emit('matchmaking:found');
      this.server.to(playerTwo).emit('matchmaking:found');
      
      console.log(`Match found between ${playerOne} and ${playerTwo}`);
  
      const userIdOne = getUserIdBySocketId(playerOne);
      const userIdTwo = getUserIdBySocketId(playerTwo);
  
      if (!isNaN(userIdOne) && !isNaN(userIdTwo)) {
        console.log('je suis dans la boucle');
        const newGame = await this.gameService.createGame(userIdOne, userIdTwo);
        this.server.emit('game:created', newGame);
  
      } else {
        console.error('Invalid player IDs:', playerOne, playerTwo);
      }
    }
    else {
      this.server.to(client.id).emit('matchmaking:searching');
    }
  }

  @SubscribeMessage('keydown')
  handleKeyDown(client: Socket, data: { key: string }) {
    console.log('Key down:', data);
    // Votre logique pour gérer la touche enfoncée
  }

  @SubscribeMessage('keyup')
  handleKeyUp(client: Socket, data: { key: string }) {
    console.log('Key up:', data);
    // Votre logique pour gérer la touche relâchée
  }

  handleStartGame(client: Socket, data: { playerOneId: number, playerTwoId: number }) {
    const playerOnePosition = { y: 200 };
    const playerTwoPosition = { y: 200 };
    this.server.emit('gameStarted', { playerOnePosition, playerTwoPosition });
  }
}
