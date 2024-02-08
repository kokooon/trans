import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './user/user.service'; // Import UserService
import { addUserSocketPair, getSocketIdByUserId, removeUserSocketPair } from './entities/socket.map';
import { getUserIdBySocketId } from './entities/socket.map';
import { getCurrentMapState } from './entities/socket.map';
import { GameService } from './game/game.service';

@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:3000', // The URL of your front-end application
    methods: ['GET', 'POST'], // Allowed HTTP request methods for CORS preflight requests
    credentials: true, // Indicates whether the request can include user credentials like cookies, HTTP authentication or client side SSL certificates
  },
})
export class SocialGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private userService: UserService,
    private readonly gameService: GameService,
  ) {}

  @WebSocketServer()
  private server: Server;

// Handle 'new message' event
  @SubscribeMessage('new_message')
  async handleNewMessage(@MessageBody() data: any, client: Socket): Promise<void> {
  // Process the message data
  // ...
  // Example: Emitting the message to the recipient
  const recipientSocketId = getSocketIdByUserId(data.recipientId);
  const senderSocketId = getSocketIdByUserId(data.senderId);
  if (senderSocketId) {
    this.server.to(senderSocketId).emit('new_message', data);
  }
  if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('new_message', data);
  }
}

@SubscribeMessage('new_friend')
async handleNewFriend(@MessageBody() data: any, client: Socket): Promise<void> {

  const friendid = await this.userService.findIdByPseudo(data.recipientId);
  const recipientSocketId = getSocketIdByUserId(friendid);
  if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('new_friend', data);
  }
}

@SubscribeMessage('new_notification')
async handleNewNotif(@MessageBody() data: any, client: Socket): Promise<void> {

  const friendid = await this.userService.findIdByPseudo(data.recipientId);
  const recipientSocketId = getSocketIdByUserId(friendid);
  if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('new_notification', data);
  }
}
// Handle 'new message' event
@SubscribeMessage('new_channel_message')
async handleNewChannelMessage(@MessageBody() data: any, client: Socket): Promise<void> {
const senderSocketId = getSocketIdByUserId(data.senderId);
if (senderSocketId) {
  this.server.to(senderSocketId).emit('new_channel_message', data);
}
data.recipientId.forEach(recipientId => {
  const recipientSocketId = getSocketIdByUserId(recipientId);

  if (recipientSocketId) {
    this.server.to(recipientSocketId).emit('new_channel_message', data);
  }
});
}
//loop in data.recipientId[] and emit event if socket of this user exist


  async handleConnection(client: Socket, ...args: any[]) {
    client.join(client.id)
    const userId = await this.authenticateUser(client, args);
    if (userId) {
      addUserSocketPair(userId, client.id);
      try {
        const friends = await this.userService.getFriends(userId);
        if (friends.length > 0) {
          //const connectedUserData = { userId, disconnected: false };
          for (const friendId of friends) {
            const friendSocketId = getSocketIdByUserId(Number(friendId));
            if (friendSocketId) {
              this.server.to(friendSocketId).emit('friendConnected');
            } else {
              console.log(`No friendSocketId found for friend: ${friendId}`);
            }
          }
        }
      } catch (error) {
        console.error('Error handling connection:', error);
      }
      console.log("map = ", getCurrentMapState());
    } else {
      console.log("userId null in gateway");
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = getUserIdBySocketId(client.id);
    if (userId) {
      removeUserSocketPair(userId);
      try {
        const friends = await this.userService.getFriends(userId);
        if (friends.length > 0) {
          const disconnectedUserData = { userId, disconnected: true };
          for (const friendId of friends) {
            const friendSocketId = getSocketIdByUserId(Number(friendId));
            if (friendSocketId) {
              this.server.to(friendSocketId).emit('friendDisconnected');
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
