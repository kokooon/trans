import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    // ... other dependencies
  ) {}

  async createMessage(createChannelDto): Promise<Message> {
    const channel = new Message();
    // Populate the channel entity using createChannelDto
    // For example:
    // channel.name = createChannelDto.name;
    // channel.status = createChannelDto.status;
    // channel.password = createChannelDto.password;
    
    return this.messageRepository.save(channel);
  }

  // Define methods to handle message operations here
}