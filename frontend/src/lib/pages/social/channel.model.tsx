import { Message } from './message.model';

export interface Channel {
    id: number;
    name: string;
    memberIds: number[];
    messages: Message[];
}