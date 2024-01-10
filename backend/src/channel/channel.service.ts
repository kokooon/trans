// channel.service.ts
import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
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
    channel.password = createChannelDto.password;
    channel.admin = createChannelDto.admin;
    channel.memberIds = createChannelDto.memberIds;
    return this.channelRepository.save(channel);
  }

  async addUserId(userId: number, channel: Channel){
    if (!channel.memberIds.includes(userId))
    {
      channel.memberIds.push(userId);
      await this.channelRepository.save(channel);
    }
  }

  async findChannelByName(name: string): Promise<Channel | undefined> {
    return this.channelRepository.findOneBy({ name });
  }
  
  async findChannelById(id: number): Promise<Channel | undefined> {
    return this.channelRepository.findOneBy({ id });
  }
  // Add other methods as needed for your application logic
}
