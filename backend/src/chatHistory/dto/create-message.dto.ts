import { IsNotEmpty, IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string; // The content of the message

  @IsNotEmpty()
  @IsInt()
  senderId: number; // The ID of the user sending the message

  @IsOptional()
  @IsInt()
  recipientId?: number; // Optional: The ID of the user to whom the message is sent directly (for private chats)

  @IsOptional()
  @IsInt()
  channelId?: number; // Optional: The ID of the channel to which the message is sent (for channel chats)

  @IsNotEmpty()
  @IsDateString()
  createdAt: Date; // The timestamp when the message was created
}