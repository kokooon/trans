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
}
