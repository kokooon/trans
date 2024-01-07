// message.controller.ts

import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
// Import additional DTOs as needed

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {
    // Inject other services if needed
  }

  @Post('create')
  async createMessage(@Body() createMessageDto: CreateMessageDto, @Req() req, @Res() res) {
    try {
      // Here you would include logic to verify the user's identity and rights to create a message
      // For example, check if the user is authenticated or has the required role

      // Then, use the message service to create a new message with the provided DTO
      const message = await this.messageService.createMessage(createMessageDto);
      // Return the created message data
      return message;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Add other endpoints as needed for updating, deleting, or listing messages
}
