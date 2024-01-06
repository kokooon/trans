import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Message } from './message.entity';

export enum ChannelVisibility {
    PUBLIC = 'public',  // Visible to everyone
    PRIVATE = 'private', // Visible only to certain users
  }

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  password: string; // Optional: only if channels are password protected

  @Column({
    type: 'enum',
    enum: ChannelVisibility,
    default: ChannelVisibility.PUBLIC
  })
  visibility: ChannelVisibility;

  @Column('simple-array', { nullable: true })
  admin: number[];
  // Array of user IDs who are members of the channel
  @Column('simple-array', { nullable: true })
  memberIds: number[];

  @OneToMany(() => Message, message => message.channel)
  messages: Message[];

  // Add other channel properties and methods below as needed
}