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

  async kick(channel: Channel, kickId: number) {
		channel.memberIds = channel.memberIds.filter(id => Number(id) !== kickId)
		await this.channelRepository.save(channel);
		return;
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
