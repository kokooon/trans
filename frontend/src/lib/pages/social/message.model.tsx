//frontend message model

export interface Message {
    id: number;
    sender: number;
    content: string;
    createdAt: Date;
    recipient: number;
    channel: number;
}