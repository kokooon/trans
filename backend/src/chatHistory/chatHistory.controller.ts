// message.controller.ts
import { Controller, Get, Param, Post, Body, BadRequestException, Query, Req, Res } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { chatHistoryService } from './chatHistory.service';
import { CreatechatHistoryDto } from './dto/create-chatHistory.dto';
// Import additional DTOs as needed
import { chatHistory} from '../entities/chatHistory.entity';
import { CreateMessageDto } from './dto/create-message.dto'; // Import the DTO for message creation

@Controller('chatHistory')
export class chatHistoryController {
  constructor(private readonly chatHistoryService: chatHistoryService) {
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

  @Get('history/:userId/:friendId')
  async getFriendHistory(@Param('userId') userId: Number, @Req() req, @Res() res): Promise<chatHistory | void> {
      ;
  }

  @Post('newPrivateMessage')
  async addMessage(@Body() createMessageDto: CreateMessageDto): Promise<void> {
      try {
          const updatedChatHistory = await this.chatHistoryService.addOrUpdateMessage(createMessageDto);
          //return updatedChatHistory;
      } catch (error) {
          throw new HttpException('Error processing message', HttpStatus.BAD_REQUEST);
      }
  }

  // Add other endpoints as needed for updating, deleting, or listing messages
}
