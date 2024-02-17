// channel.controller.ts
import { Channel } from '../entities/channel.entity';
import { Controller, Get, Param, Post, Body, BadRequestException, Query, Req, Res } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
// Import additional DTOs as needed
import { getSocketIdByUserId } from '../entities/socket.map';
import bcrypt from 'bcryptjs';

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

  @Post('findChannelByName/:channelName')
  async findChannelByNamePost(
    @Param('channelName') channelName: string,
    @Body('passwordInput') passwordInput: string,
    @Res() res
  ): Promise<Channel | void> {
    const channel = await this.channelService.findChannelByName(channelName);
    var isPasswordCorrect = true;
    if (channel) {
      if (channel.password != '')
        isPasswordCorrect = await bcrypt.compareSync(passwordInput, channel.password);

      if (isPasswordCorrect) {
        return res.status(200).json(channel);
      } else {
        return res.status(401).json({ error: 'Mot de passe incorrect' });
      }
    } else {
      return res.status(404).json({ error: 'Can\'t find channel' });
    }
  }

  @Get('findChannelByName/:channelName')
  async findChannelByNameGet(
    @Param('channelName') channelName: string,
    @Res() res
  ): Promise<Channel | void> {
    const channel = await this.channelService.findChannelByName(channelName);

    if (channel) {
      return res.status(200).json(channel);
    } else {
      return res.status(404).json({ error: 'Can\'t find channel' });
    }
  }


  @Post('addUserId/:userId')
    async addUserId(@Param('userId') userId: number, @Req() req, @Res() res): Promise<void> {
      try {
        const channel = await this.channelService.findChannelByName(req.body.channelName);
        await this.channelService.addUserId(userId, channel);
        
        return res.status(201).json({
          status: 'success',
          message: 'User added to channel successfully',
        });
      } catch (error) {
        console.error('Error adding user to channel:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Failed to add user to channel',
        });
      }
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

@Get('isMuted/:channelid/:userid') // Définissez le paramètre dans l'URL comme ":userId"
    async isMuted(@Param('channelid') channelid: number, @Param('userid') userid: number, @Res() res): Promise<void> {
      const channel = await this.channelService.findChannelById(channelid);
    if (channel) {
      const result = await this.channelService.isMuted(channel, userid)
      console.log(result);
      if (result) {
        return res.status(200).json({ isMuted: true });
      } else {
        return res.status(200).json({ isMuted: false });
      }
    }
    else
      return res.status(409).json({ error: 'can\'t find channel' });
  }

@Post('mute')
  async mute(@Req() req, @Res() res): Promise<void> {
    const channel = await this.channelService.findChannelById(req.body.channel);
    if (channel){
        await this.channelService.mute(channel, req.body.muteId)
    }
    else{
        return res.status(409).json({ error: 'can\'t find channel' });
    }
  }

@Get('isBanned/:channelid/:userid') // Définissez le paramètre dans l'URL comme ":userId"
    async isBanned(@Param('userid') userid: number, @Param('channelid') channelid: number, @Res() res): Promise<void> {
  const channel = await this.channelService.findChannelById(channelid);
    if (channel) {
      const result = await this.channelService.isBanned(channel, userid)
      if (result){
        return res.status(201).json('Banned');
      }
      else {
        return res.status(201).json('ok');
      }
    }
    else
      return res.status(409).json({ error: 'can\'t find channel' });
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

  @Post('Ban')
  async Ban(@Req() req): Promise<void> {
    const channel = await this.channelService.findChannelByName(req.body.channel);
    await this.channelService.ban(channel, req.body.banId);
  }

  @Post('kick')
  async kick(@Req() req): Promise<void> {
    const channelName = req.body.channel;
    const channel = await this.channelService.findChannelByName(channelName);
    await this.channelService.kick(channel, req.body.kickId);
  }

  @Post('setAsAdmin')
  async setAdmin(@Req() req): Promise<void> {
    const channelName = req.body.channel;
    const channel = await this.channelService.findChannelByName(channelName);
    await this.channelService.setAdmin(channel, req.body.newAdmin);
  }

  @Post('deletePassword')
  async deletePassword(@Req() req): Promise<void> {
    const channelId = req.body.channelid;
    const channel = await this.channelService.findChannelById(channelId);
    await this.channelService.deletePassword(channel);
  }
}