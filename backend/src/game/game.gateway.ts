import { WebSocketGateway, OnGatewayConnection, SubscribeMessage, WebSocketServer, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { getUserIdBySocketId } from 'src/entities/socket.map';
import { GameData } from './gameData';
import { GameInstance } from './gameInstance';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private matchmakingQueue: string[] = [];
  private gameData: Map<number, GameData> = new Map<number, GameData>();

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket, ...args: any[]) {
  }

  @SubscribeMessage('matchmaking:request')
  async handleMatchmaking(client: Socket): Promise<void> {
    console.log('Matchmaking request received from', client.id);
    
    if (this.matchmakingQueue.includes(client.id)) {
      console.log('Player is already in the matchmaking queue.');
      return;
    }
  
    this.matchmakingQueue.push(client.id);
    console.log(this.matchmakingQueue);

    if (this.matchmakingQueue.length >= 2) {
      const [playerOne, playerTwo] = this.matchmakingQueue.splice(0, 2);
      
      this.server.to(playerOne).emit('matchmaking:found');
      this.server.to(playerTwo).emit('matchmaking:found');
      
      console.log(`Match found between ${playerOne} and ${playerTwo}`);
  
      const userIdOne = getUserIdBySocketId(playerOne);
      const userIdTwo = getUserIdBySocketId(playerTwo);

      console.log('userIdone = ', userIdOne);
      console.log('userIdTwo = ', userIdTwo);
      
      if (userIdOne && userIdTwo) {
        try {
          const newGame = await this.gameService.createGame(userIdOne, userIdTwo);
          this.gameData.set(userIdOne, newGame);
          this.gameData.set(userIdTwo, newGame);
          this.server.emit('game:created', newGame);
        } catch (error) {
          console.error('Error creating game:', error);
        }
      } else {
        console.error('User IDs not found for players:', playerOne, playerTwo);
      }
    }
    else {
      this.server.to(client.id).emit('matchmaking:searching');
    }
  }

  @SubscribeMessage('keydown')
  async handleKeyDown(client: Socket, data: { key: string }) {
    console.log('Key down:', data);
    const userId = getUserIdBySocketId(client.id);
    if (!userId) {
      console.error('User ID not found for client:', client.id);
      return;
    }
    const gameData = this.gameData.get(userId);
    
    if (!gameData) {
      console.error('Game instance not found for user:', userId);
      return;
    }
    try {
      const game = gameData.game;
      const gameInstance = gameData.gameinstance;
      if (!gameInstance) {
        console.error('Game not found for user:', userId);
        return;
      }
    if (data.key === 'ArrowUp') {
      console.log(userId);
      if (userId === game.userA) {
        gameInstance.playerAPosition.y -= 10;
      } else if (userId === game.userB) {
        gameInstance.playerBPosition.y -= 10;
      }
    } else if (data.key === 'ArrowDown') {
      if (userId === game.userA) {
        gameInstance.playerAPosition.y += 10;
      } else if (userId === game.userB) {
        gameInstance.playerBPosition.y += 10;
      }
    }
    
    this.server.emit('gameState', { 
      playerAPosition: gameInstance.playerAPosition.y, 
      playerBPosition: gameInstance.playerBPosition.y,
      ballPosition: gameInstance.ball 
    });
  }
    catch (error) {
      console.error('Error:', error);
    }
  }
  

  @SubscribeMessage('keyup')
  handleKeyUp(client: Socket, data: { userId: number, key: string }) {
    console.log('Key up:', data);
  }

  async handleDisconnect(client: Socket) {
    const index = this.matchmakingQueue.indexOf(client.id);
    if (index !== -1) {
      this.matchmakingQueue.splice(index, 1);
      console.log(`Socket ${client.id} disconnected and removed from matchmaking queue.`);
    } else {
      console.log(`Socket ${client.id} disconnected.`);
    }
  }
}
