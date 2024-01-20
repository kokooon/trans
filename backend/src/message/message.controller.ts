// message.controller.ts
import { Controller, Get, Param, Post, Body, BadRequestException, Query, Req, Res } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
// Import additional DTOs as needed
import { Message} from '../entities/message.entity';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {
    // Inject other services if needed
  }

  @Post()
  async createMessage(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
      try {
          const newMessage = await this.messageService.create(createMessageDto);
          return newMessage;
      } catch (error) {
          // Handle errors (e.g., validation errors, database errors)
          throw new HttpException('Error creating message', HttpStatus.BAD_REQUEST);
      }
  }

  @Get('history/:userId/:friendId')
  async getFriendHistory(@Param('userId') userId: Number, @Req() req, @Res() res): Promise<Message[] | void> {
      ;
  }

  // Add other endpoints as needed for updating, deleting, or listing messages
}
