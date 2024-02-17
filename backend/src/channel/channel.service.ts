// channel.service.ts
import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import bcrypt from 'bcryptjs';
// import additional services if needed

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    // Inject other services if needed, e.g., config service or any other service
  ) {}

  // Example method to create a channel
  async createChannel(createChannelDto): Promise<Channel | void> {
    const channel = new Channel();
    channel.name = createChannelDto.name;
    channel.visibility = createChannelDto.visibility;
    if (createChannelDto.password != '')
      channel.password = bcrypt.hashSync(createChannelDto.password, 10);
    else
      channel.password = createChannelDto.password;
    channel.admin = createChannelDto.admin;
    channel.owner = createChannelDto.admin;
    channel.banned = [];
    channel.muted = [];
    /*if (createChannelDto.visibility === 'public'){
		
    }*/
    channel.memberIds = createChannelDto.memberIds;
    return this.channelRepository.save(channel);
  }

  async deletePassword(channel: Channel){
      channel.password = null;
      await this.channelRepository.save(channel);
  }

  async addUserId(userId: number, channel: Channel){
    if (!channel.memberIds.includes(userId))
    {
      channel.memberIds.push(userId);
      await this.channelRepository.save(channel);
    }
  }

  async isBanned(channel: Channel, banId: number) {
    if (channel.banned.includes(banId)){
      return true;
    }
    else{
      console.log('returned false');
      return false;
    }
  }

  async ban(channel: Channel, banId: number) {
    channel.banned.push(banId);
    channel.memberIds = channel.memberIds.filter(id => Number(id) !== banId)
		await this.channelRepository.save(channel);
		return;
  }

  async kick(channel: Channel, kickId: number) {
		channel.memberIds = channel.memberIds.filter(id => Number(id) !== kickId)
		await this.channelRepository.save(channel);
		return;
  }

  async isMuted(channel: Channel, userId: number): Promise<boolean> {
    const now = Date.now();
    const muteEntry = channel.muted.find(mute => mute.userId === Number(userId));
    return !!muteEntry && muteEntry.expireAt > now;
  }

  async mute(channel: Channel, userId: number, duration: number = 300000) { // 5 minutes by default
    const expireAt = Date.now() + duration;
    // Add or update the mute entry for the user
    const mutedUserIndex = channel.muted.findIndex(mute => mute.userId === userId);
    if (mutedUserIndex > -1) {
      channel.muted[mutedUserIndex].expireAt = expireAt;
    } else {
      channel.muted.push({ userId, expireAt });
    }
    
    // Save changes to the database
    await this.channelRepository.save(channel);
  
    // Optionally, schedule an unmute operation if your application's architecture allows it
  }

  async setAdmin(channel: Channel, newAdmin: number) {
		channel.admin.push(newAdmin);
		await this.channelRepository.save(channel);
		return;
  }

  async MemberStatus(userId: number, channel: Channel): Promise<string> {
    if (String(channel.owner) === String(userId))
        return ('Owner');
    else if (channel.admin.includes(userId))
        return ('Admin');
    else
        return ('Member');
  }

  async findChannelByName(Name: string): Promise<Channel | undefined> {
    return this.channelRepository.findOne({ where: { name: Name } });
  }
  
  async findChannelById(id: number): Promise<Channel | undefined> {
    return this.channelRepository.findOneBy({ id });
  }
  // Add other methods as needed for your application logic
}
