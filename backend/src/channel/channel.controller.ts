// channel.controller.ts
import { Channel } from '../entities/channel.entity';
import { Controller, Get, Param, Post, Body, BadRequestException, Query, Req, Res } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
// Import additional DTOs as needed
import { getSocketIdByUserId } from '../entities/socket.map';

@Controller('channels')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    // Inject other services if needed
  ) {}

  @Get('channelNameById/:channelId')
  async getChannelName(@Param('channelId') channelId: number): Promise<string> {
      const channel = this.channelService.findChannelById(channelId);
      return (await channel).name;
  }

  @Post('create')
  async createChannel(@Body() createChannelDto: CreateChannelDto, @Req() req, @Res() res): Promise<Channel | void> {
    try {
      const channelCheck = await this.channelService.findChannelByName(createChannelDto.name);
      if (channelCheck) {
      return res.status(409).json({ error: 'Channel name already taken' });
    }
      const channel = await this.channelService.createChannel(createChannelDto);
      return res.status(201).json(channel); // Make sure to return a response with JSON
    } catch (error) {
      console.log("failed to create in the POST: ", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  @Get('lastMessage/:channelId') // Définissez le paramètre dans l'URL comme ":userId"
  async findPseudoById(@Param('channelId') channelId: number,  @Req() req, @Res() res): Promise<any> {
	try {
	  const channel = await this.channelService.findChannelById(channelId)
	  if (channel) {
			const Channel = {
			  id: channel.id,
			  name: channel.name,
			  membersIds: channel.memberIds,
			  owner: channel.owner,
			  admins: channel.admin
			};
			return res.status(201).json(Channel);
		  }
	   else {
		return res.status(404).json('cannot return channel');
	  }
	} catch (error) {
		return res.status(404).json('cannot return channel');
	}
  }

  @Get('findChannelByName/:channelName') // Définissez le paramètre dans l'URL comme ":userId"
  async findChannelByName(@Param('channelName') channelName: string,  @Req() req, @Res() res): Promise<Channel | void> {
    const channel = await this.channelService.findChannelByName(channelName);
    if (channel)
    return res.status(201).json(channel);
    else
      return res.status(409).json({ error: 'can\'t find channel' });
  }


  @Post('addUserId/:userId')
    async addUserId(@Param('userId') userId: number, @Req() req, @Res() res): Promise<void> {
      const channel = await this.channelService.findChannelByName(req.body.channelName);
      await this.channelService.addUserId(userId, channel);
    }
  // Add other endpoints as needed for updating, deleting, or listing channels

@Get('returnMemberStatus/:userId/:channelId') // Définissez le paramètre dans l'URL comme ":userId"
	async returnMembersStatus(@Param('userId') userId: number, @Param('channelId') channelId: number): Promise<string> {
  	const channel = await this.channelService.findChannelById(channelId);
	if (channel) {
  		const status = this.channelService.MemberStatus(userId, channel)
  		return status;
  	}
  	else
    	return 'error';
}

@Get('returnMembers/:channelId') // Définissez le paramètre dans l'URL comme ":userId"
    async returnChannelMembers(@Param('channelId') channelId: number,  @Req() req, @Res() res): Promise<number[] | void> {
  const channel = await this.channelService.findChannelById(channelId);
    if (channel) {
      return res.status(201).json(channel.memberIds);
    }
    else
      return res.status(409).json({ error: 'can\'t find channel' });
  }

  @Post('deletePassword')
  async deletePassword(@Req() req, @Res() res): Promise<void> {
    const channelId = req.body.channelid;
    const channel = await this.channelService.findChannelById(channelId);
    await this.channelService.deletePassword(channel);
  }

}