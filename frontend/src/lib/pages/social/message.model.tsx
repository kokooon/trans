import { Channel } from './channel.model';

export interface Message {
    id: number;
    sender: number;
    content: string;
    createdAt: Date;
    recipient: number;
    channel: Channel;
}