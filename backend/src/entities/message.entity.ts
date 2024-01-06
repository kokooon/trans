import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Channel } from './channel.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  content: string;

  @ManyToOne(() => User, user => user.sentMessages)
  sender: User;

  // Nullable: For messages sent to a channel
  @ManyToOne(() => Channel, channel => channel.messages, { nullable: true })
  channel: Channel;

  // Nullable: For direct messages to a user
  @ManyToOne(() => User, user => user.receivedMessages, { nullable: true })
  recipient: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}