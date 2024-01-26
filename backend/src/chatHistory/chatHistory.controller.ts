// message.controller.ts
import { Controller, Get, Param, Post, Body, BadRequestException, Query, Req, Res } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { chatHistoryService } from './chatHistory.service';
import { CreatechatHistoryDto } from './dto/create-chatHistory.dto';
// Import additional DTOs as needed
import { chatHistory} from '../entities/chatHistory.entity';
import { CreateMessageDto } from './dto/create-message.dto'; // Import the DTO for message creation
import { UserService } from 'src/user/user.service';

type ChatMessage = {
    senderPseudo: string;
    content: string;
    createdAt: string;
    avatar: string;
    };

@Controller('chatHistory')
export class chatHistoryController {
  constructor(private readonly chatHistoryService: chatHistoryService, private readonly userService: UserService) {
    // Inject other services if needed
  }

  @Post()
  async createchatHistory(@Body() CreatechatHistoryDto: CreatechatHistoryDto): Promise<chatHistory> {
      try {
          const newchatHistory = await this.chatHistoryService.create(CreatechatHistoryDto);
          return newchatHistory;
      } catch (error) {
          // Handle errors (e.g., validation errors, database errors)
          throw new HttpException('Error creating chatHistory', HttpStatus.BAD_REQUEST);
      }
  }

  @Get('history/channel/:channelId/:blockedUsers')
  async getChannelHistory(@Param('channelId') channelId: number, @Param('blockedUsers') blockedUsers: number[]): Promise<ChatMessage[]> {
      try {
        //if (blockedUsers[0] !== 0) {
          console.log('im in the getter = ', blockedUsers);
        //}
        const pseudos = new Set<string>();
        for (const id of blockedUsers) {
          if (id > 0){
            console.log('id of blocked = ', id);
            const pseudo = await this.userService.findPseudoById(id);
            if (pseudo) {
              pseudos.add(pseudo);
          }
        }
      }
        //findPseudoById()
        console.log('blocked users in string = ', pseudos);
        const chatMessages: ChatMessage[] = [];
          const chatHistories = await this.chatHistoryService.getChannelHistory(channelId);
          if (!chatHistories) {
              throw new HttpException('Chat history not found', HttpStatus.NOT_FOUND);
          }else {
            chatHistories.forEach(chatHistory => {
                // Parse the JSON string in the messages field
                const messages = JSON.parse(chatHistory.messages);
                // messages is now an array of message objects
                // Access the content property of each message
                const validMessages = messages.filter(message => !pseudos.has(message.userPseudo));

            // Process valid messages
            validMessages.forEach(message => {
              const messageToAdd: ChatMessage = {
                content: message.content,
                avatar: message.avatar,
                senderPseudo: message.userPseudo,
                createdAt: message.createdAt
            };
            chatMessages.push(messageToAdd);
        });
    });
    return chatMessages;
          }
      } catch (error) {
          throw new HttpException('Error fetching chat history', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  @Get('history/:userId/:friendId')
  async getFriendHistory(@Param('userId') userId: number, @Param('friendId') friendId: number): Promise<ChatMessage[]> {
      try {
        const chatMessages: ChatMessage[] = [];
          const chatHistories = await this.chatHistoryService.getFriendHistory(userId, friendId);
          if (!chatHistories) {
              throw new HttpException('Chat history not found', HttpStatus.NOT_FOUND);
          }else {
            chatHistories.forEach(chatHistory => {
                // Parse the JSON string in the messages field
                const messages = JSON.parse(chatHistory.messages);
                // messages is now an array of message objects
                // Access the content property of each message
                messages.forEach(message => {
                    const messageToAdd: ChatMessage = { // Ensure the object matches ChatMessage type
                        content: message.content,
                        avatar: message.avatar,
                        senderPseudo: message.userPseudo,
                        createdAt: message.createdAt
                      };
                      chatMessages.push(messageToAdd);
                });
              });
            return chatMessages;
          }
      } catch (error) {
          throw new HttpException('Error fetching chat history', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  @Post('newPrivateMessage')
  async addMessage(@Body() createMessageDto: CreateMessageDto): Promise<chatHistory> {
      try {
          const updatedChatHistory = await this.chatHistoryService.addOrUpdateMessage(createMessageDto);
          return updatedChatHistory;
      } catch (error) {
          throw new HttpException('Error processing message', HttpStatus.BAD_REQUEST);
      }
  }

  // Add other endpoints as needed for updating, deleting, or listing messages
}
