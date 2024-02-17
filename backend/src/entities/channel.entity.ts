import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ChannelVisibility } from '../channel/dto/channel-visibility.enum'; // Import this from where you defined the enum

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

  @Column('simple-array', { nullable: true })
  owner: number;
  // Array of user IDs who are members of the channel
  @Column('simple-array', { nullable: true })
  memberIds: number[];

  @Column('simple-array', { nullable: true })
  banned: number[];

  @Column({ type: 'json', nullable: true })
  muted: { userId: number, expireAt: number }[];
  // Add other channel properties and methods below as needed
}