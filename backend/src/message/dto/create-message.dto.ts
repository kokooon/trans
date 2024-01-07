// create-message.dto.ts

import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsInt()
  senderId: number; // The ID of the user sending the message

  @IsOptional()
  @IsInt()
  channelId?: number; // Optional: The ID of the channel to which the message is sent

  @IsOptional()
  @IsInt()
  recipientId?: number; // Optional: The ID of the user to whom the message is sent directly
}
