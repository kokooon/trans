import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { chatHistory } from '../entities/chatHistory.entity';
import { CreatechatHistoryDto } from './dto/create-chatHistory.dto';
import { CreateMessageDto } from './dto/create-message.dto'; // Import the DTO for message creation

@Injectable()
export class chatHistoryService {
  constructor(
    @InjectRepository(chatHistory)
    private readonly chatHistoryRepository: Repository<chatHistory>,
    // ... other dependencies
  ) {}

  async addOrUpdateMessage(createMessageDto: CreateMessageDto): Promise<void> {
    const { senderId, recipientId, channelId, content } = createMessageDto;

    console.log('messagedto = ', createMessageDto);
    // Logic to determine if it's a private or channel chat
    const chatIdentifier = channelId || [senderId, recipientId].sort().join('_');

    /*let chatHistory = await this.chatHistoryRepository.findOne({ where: { user1Id, user2Id } });

    if (!chatHistory) {
        // Create a new chat history if it doesn't exist
        chatHistory = this.chatHistoryRepository.create({ identifier: chatIdentifier, messages: [] });
    }

    // Add the new message to the messages array
    chatHistory.messages.push({ senderId, content, createdAt: new Date() });
    
    // Save the updated chat history
    return this.chatHistoryRepository.save(chatHistory);*/
}

  async create(createchatHistoryDto: CreatechatHistoryDto): Promise<chatHistory> {
    const newchatHistory = this.chatHistoryRepository.create(createchatHistoryDto);
    
    try {
        return await this.chatHistoryRepository.save(newchatHistory);
    } catch (error) {
        // Handle any database errors
        throw new Error('Error saving chatHistory to the database');
    }
}

  // Define methods to handle chatHistory operations here
}