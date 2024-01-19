import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './user/user.service'; // Import UserService
import { addUserSocketPair, getSocketIdByUserId, removeUserSocketPair } from './entities/socket.map';
import { getUserIdBySocketId } from './entities/socket.map';
import { getCurrentMapState } from './entities/socket.map';

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
    console.log(`Client connected: ${client.id}`);
    // This will be called when a client connects to the gateway
    const userId = await this.authenticateUser(client, args);
    if (userId) {
      addUserSocketPair(userId, client.id);
      console.log("map = ", getCurrentMapState());
    }
    else
      console.log("userId null in gateway");
  }

  async handleDisconnect(client: Socket) {
    // This will be called when a client disconnects from the gateway
    console.log(`Client disconnected: ${client.id}`);
    const userId = getUserIdBySocketId(client.id);
    if (userId) {
      // Remove the user and socket ID from the map
      removeUserSocketPair(userId);
    }
  }
  // You can add more event handlers and business logic as needed
  private async authenticateUser(client: Socket, args: any[]): Promise<number | null> {
    // Implement authentication logic here and return the user ID if successful, null otherwise
    const userId = client.handshake.query.userId;
    const userIdString = Array.isArray(userId) ? userId[0] : userId;
    const userIdNumber = parseInt(userIdString, 10);
    if (userIdNumber)
      return userIdNumber;
    else
      return null;
  }
}
