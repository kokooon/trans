import { WebSocketGateway, OnGatewayConnection, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { getUserIdBySocketId } from 'src/entities/socket.map';
import { GameInstance } from './ball';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private matchmakingQueue: string[] = [];
  private gameInstances: { [userId: string]: GameInstance } = {};

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket, ...args: any[]) {
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
        const newGame = await this.gameService.createGame(userIdOne, userIdTwo);
        this.gameInstances[String(userIdOne)] = newGame.gameInstance;
        this.gameInstances[String(userIdTwo)] = newGame.gameInstance;
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
    const userId = getUserIdBySocketId(client.id);
    const gameInstance = this.gameInstances[userId];
    
    if (!gameInstance) {
      console.error('Game instance not found for user:', userId);
      return;
    }
    
    // Mettez à jour la position du joueur en fonction de la touche enfoncée
    if (data.key === 'ArrowUp') {
      console.log('je modifie la position');
      gameInstance.playerAPosition.y -= 10;
    } else if (data.key === 'ArrowDown') {
      gameInstance.playerAPosition.y += 10;
    }
    
    // Envoyez les positions mises à jour aux clients concernés
    this.server.emit('gameState', { playerPositions: gameInstance.playerAPosition, ball: gameInstance.ball });
  }
  

  @SubscribeMessage('keyup')
  handleKeyUp(client: Socket, data: { userId: number, key: string }) {
    console.log('Key up:', data);
    // Vous pouvez ajouter une logique supplémentaire ici si nécessaire
  }

  async handleDisconnect(client: Socket) {
    const index = this.matchmakingQueue.indexOf(client.id);
    if (index !== -1) {
      this.matchmakingQueue.splice(index, 1); // Retirer le client de la file d'attente
      console.log(`Socket ${client.id} disconnected and removed from matchmaking queue.`);
    } else {
      console.log(`Socket ${client.id} disconnected.`);
    }
  }
}
