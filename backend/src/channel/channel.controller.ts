// channel.controller.ts
import { Channel } from '../entities/channel.entity';
import { Controller, Post, Body, Req, Res, HttpStatus, HttpException } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
// Import additional DTOs as needed

@Controller('channels')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    // Inject other services if needed
  ) {}

  @Post('create')
  async createChannel(@Body() createChannelDto: CreateChannelDto, @Req() req, @Res() res): Promise<Channel> {
    try {
      const channel = await this.channelService.createChannel(createChannelDto);
      return res.status(201).json(channel); // Make sure to return a response with JSON
    } catch (error) {
      console.log("failed to create in the POST: ", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
  
/*  @Post('join')
  async joinChannel(
    // Include DTO for joining a channel, which might include the channel name and optional password
    @Body() joinChannelDto, 
    @Req() req, 
    @Res() res
  ) {
    try {
      // Similar to create, include logic to verify the user's identity

      // Then, use the channel service to join the channel
      const result = await this.channelService.joinChannel(joinChannelDto);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }*/

  // Add other endpoints as needed for updating, deleting, or listing channels
}
