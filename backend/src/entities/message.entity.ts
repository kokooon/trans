import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Channel } from './channel.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  content: string;

  @Column({ type: 'int', nullable: true })
  sender: number;

  // Nullable: For messages sent to a channel
  @Column({ type: 'int', nullable: true })
  channel: number;

  // Nullable: For direct messages to a user
  @Column({ type: 'int', nullable: true })
  recipient: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}