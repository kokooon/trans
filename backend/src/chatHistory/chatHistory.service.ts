import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { chatHistory } from '../entities/chatHistory.entity';
import { CreatechatHistoryDto } from './dto/create-chatHistory.dto';
import { CreateMessageDto } from './dto/create-message.dto'; // Import the DTO for message creation
import { UserService } from 'src/user/user.service';

@Injectable()
export class chatHistoryService {
  constructor(
    private userService: UserService,
    @InjectRepository(chatHistory)
    private readonly chatHistoryRepository: Repository<chatHistory>,
    // ... other dependencies
  ) {}

  async getFriendHistory(userId: number, friendId: number): Promise<any> {
    // Fetch the raw chat history data
    const chatHistories = await this.chatHistoryRepository.find({
      where: [
          { user1Id: userId, user2Id: friendId },
          { user1Id: friendId, user2Id: userId }
      ]
      });
    // Transform the data into a cleaner format
    /*const transformedChatHistory = rawChatHistory.map(message => {
        return {
            messageId: message.id,
            senderId: message.senderId,
            content: message.content,
            timestamp: message.createdAt, // Format date if needed
            // Include other necessary fields
        };
    });*/

    return chatHistories;
}

  async addOrUpdateMessage(createMessageDto: CreateMessageDto): Promise<chatHistory> {
    const { senderId, recipientId, channelId, content, createdAt } = createMessageDto;

    let userIds: number[] | undefined;
    const user = await this.userService.findById(senderId);
    const userPseudo = user.pseudo;
    let chatHistory: chatHistory;
    if (channelId) {
      // It's a channel chat
      chatHistory = await this.chatHistoryRepository.findOne({ where: { channelId } });
    } else if (recipientId) {
      // It's a private chat
      userIds = [senderId, recipientId].sort();
      chatHistory = await this.chatHistoryRepository.findOne({ 
        where: { 
          user1Id: userIds[0], 
          user2Id: userIds[1] 
        } 
      });
    } else {
      throw new Error("Chat type not specified");
    }
  
    if (!chatHistory) {
      // Create new chat history
      chatHistory = this.chatHistoryRepository.create({
        channelId, 
        user1Id: userIds ? userIds[0] : null,
        user2Id: userIds ? userIds[1] : null,
        messages: JSON.stringify([{ userPseudo, content, createdAt }])
      });
    } else {
      // Update existing chat history
      const messages = chatHistory.messages ? JSON.parse(chatHistory.messages) : [];
      messages.push({ userPseudo, content, createdAt });
      chatHistory.messages = JSON.stringify(messages);
    }
  
    return this.chatHistoryRepository.save(chatHistory);
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