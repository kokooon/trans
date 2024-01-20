import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    // ... other dependencies
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const newMessage = this.messageRepository.create(createMessageDto);
    
    try {
        return await this.messageRepository.save(newMessage);
    } catch (error) {
        // Handle any database errors
        throw new Error('Error saving message to the database');
    }
}

  // Define methods to handle message operations here
}