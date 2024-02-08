import { WebSocketGateway, OnGatewayConnection, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Le gamegateway ecoute:', client.id);
  }

  @SubscribeMessage('game:created')
  async handleGameCreated(client: Socket, data: any) {
    console.log('New game created:', data);
    // Utilisez le service GameService si nécessaire
  }
}
