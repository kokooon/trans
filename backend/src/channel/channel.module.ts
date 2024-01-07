// channel.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../entities/channel.entity';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    // Include other modules that ChannelModule depends on, if any
  ],
  controllers: [ChannelController], // Controller for channel-related routes
  providers: [ChannelService],      // Service that contains business logic for channels
  exports: [ChannelService]       // Export ChannelService if it will be used outside of this module
})
export class ChannelModule {}
