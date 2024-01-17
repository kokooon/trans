import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './user/user.service'; // Import UserService

@WebSocketGateway({
    cors: {
      origin: 'http://127.0.0.1:3000', // The URL of your front-end application
      methods: ['GET', 'POST'], // Allowed HTTP request methods for CORS preflight requests
      credentials: true, // Indicates whether the request can include user credentials like cookies, HTTP authentication or client side SSL certificates
    },
  })
export class SocialGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private userService: UserService) {}

  async handleConnection(client: Socket, ...args: any[]) {
    // This will be called when a client connects to the gateway
    const userId = client.handshake.query.userId;
    const userIdString = Array.isArray(userId) ? userId[0] : userId;
    const userIdNumber = parseInt(userIdString, 10);
    const user = await this.userService.findById(userIdNumber);
    if (user) {
      //user.socketId = client.id;
      await this.userService.save(user);
      console.log(`Client connected: ${client.id}`);
    }
  }

  async handleDisconnect(client: Socket) {
    // This will be called when a client disconnects from the gateway
    console.log(`Client disconnected: ${client.id}`);
  }
  // You can add more event handlers and business logic as needed
}
