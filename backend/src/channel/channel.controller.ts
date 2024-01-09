// channel.controller.ts
import { Channel } from '../entities/channel.entity';
import { Controller, Get, Param, Post, Body, BadRequestException, Query, Req, Res } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
// Import additional DTOs as needed

@Controller('channels')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    // Inject other services if needed
  ) {}

  @Get('channelNameById/:channelId')
  async getChannelName(@Param('channelId') channelId: number): Promise<string> {
      console.log("im here");
      const channel = this.channelService.findChannelById(channelId);
      console.log("channel = ", channel);
      console.log("test nsame = ", (await channel).name)
      return (await channel).name;
  }

  @Post('create')
  async createChannel(@Body() createChannelDto: CreateChannelDto, @Req() req, @Res() res): Promise<Channel | void> {
    try {
      const channelCheck = await this.channelService.findChannelByName(createChannelDto.name);
      if (channelCheck) {
      console.log('Channel name already taken');
      // Send a 409 Conflict response, or another appropriate status code
      return res.status(409).json({ error: 'Channel name already taken' });
    }
      const channel = await this.channelService.createChannel(createChannelDto);
      return res.status(201).json(channel); // Make sure to return a response with JSON
    } catch (error) {
      console.log("failed to create in the POST: ", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
  
  @Get('findChannelByName/:channelName') // Définissez le paramètre dans l'URL comme ":userId"
  async findChannelByName(@Param('channelName') channelName: string,  @Req() req, @Res() res): Promise<Channel | void> {
    const channel = await this.channelService.findChannelByName(channelName);
    if (channel)
      return res.status(201).json(channel);
    else
      return res.status(409).json({ error: 'can\'t find channel' });;
  }


  @Post('addUserId/:userId')
    async addUserId(@Param('userId') userId: number, @Body() channelName: any, @Req() req, @Res() res): Promise<void> {
      const channel = await this.channelService.findChannelByName(channelName.channelName);
      await this.channelService.addUserId(userId, channel);
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
