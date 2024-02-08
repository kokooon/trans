import { WebSocketGateway, OnGatewayConnection, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { getUserIdBySocketId } from 'src/entities/socket.map';

interface PlayerPositions {
  [userId: number]: { y: number };
}

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private matchmakingQueue: string[] = [];
  private playerPositions: PlayerPositions = {};

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
        this.server.emit('game:created', newGame);
  
      } else {
        console.error('Invalid player IDs:', playerOne, playerTwo);
      }
    }
    else {
      this.server.to(client.id).emit('matchmaking:searching');
    }
  }

  @SubscribeMessage('playerPositions')
  handlePlayerPositions(client: Socket, data: any): void {
    // Récupérer les nouvelles positions des joueurs depuis le frontend
    const { playerA, playerB } = data;

    // Traiter les positions comme vous le souhaitez dans votre logique de jeu

    // Émettre les nouvelles positions vers le frontend
    this.server.emit('updatePlayerPositions', { playerA, playerB });
  }

  @SubscribeMessage('keydown')
  handleKeyDown(client: Socket, data: { key: string }) {
    console.log('Key down:', data);
    const userId = client.id;
    if (!this.playerPositions[userId]) {
      this.playerPositions[userId] = { y: 200 }; // Position initiale par défaut
    }
    // Mettez à jour la position du joueur en fonction de la touche enfoncée
    if (data.key === 'ArrowUp') {
      console.log('je modifie la position');
      this.playerPositions[userId].y -= 10;
    } else if (data.key === 'ArrowDown') {
      this.playerPositions[userId].y += 10;
    }
    // Envoyez les positions mises à jour aux clients concernés
    this.server.emit('playerPositions', this.playerPositions);
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
