import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
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

  @SubscribeMessage('new_message')
  async handleNewMessage(@MessageBody() data: { chatType: string; chatId: number | number[] }): Promise<void> {
    // Notify clients to fetch the latest messages
    console.log('im in gateway new_message after send pressed')
    if (data.chatType === 'private') {
      console.log('chatType = private');
      (data.chatId as number[]).forEach(userId => {
        // Assuming you have a way to get the socket ID from the user ID
        const socketId = getSocketIdByUserId(userId);
        console.log('userid = ', userId);
        console.log('socketid = ', socketId);
		if (socketId && this.server.sockets.sockets.has(socketId)) {
			console.log('connected socket');
			this.server.to(socketId).emit('chat_updated', { chatId: data.chatId });
		  } else {
			console.log('Attempted to emit to a non-existent or disconnected socket ID:', socketId);
		  }
      });
    }
  }

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
    console.log(`Client disconnected: ${client.id}`);
    const userId = getUserIdBySocketId(client.id);
  
    if (userId) {
      removeUserSocketPair(userId);
  
      try {
        const friends = await this.userService.getFriends(userId);
        console.log('Friends:', friends);
  
        if (friends.length > 0) {
          const disconnectedUserData = { userId, disconnected: true };
  
          for (const friendId of friends) {
            const friendSocketId = getSocketIdByUserId(Number(friendId));
  
            if (friendSocketId) {
              console.log(`J'emets un signal de deconnection au front a: ${friendId}`);
              this.server.to(friendSocketId).emit('friendDisconnected', disconnectedUserData);
            }
            else {
              console.log(`No friendSocketId found for friend: ${friendId}`);
            }
        }
      } 
      }catch (error) {
        console.error('Error handling disconnect:', error);
      }
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
