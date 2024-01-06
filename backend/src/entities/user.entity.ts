import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Message, message => message.sender)
  sentMessages: Message[];

  // If you also want to track messages received by the user in direct messaging
  @OneToMany(() => Message, message => message.recipient, { nullable: true })
  receivedMessages: Message[];

  @Column({ nullable: true })
  pseudo: string;

  @Column({ nullable: true })
  pseudo42: string;
  
  @Column()
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  fortytwoId: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @Column({ default: false })
  is2FAEnabled: boolean;

  @Column('simple-array', { nullable: true })
  friendRequest: number[];

  @Column('simple-array', { nullable: true })
  friendNotifications: number[];

  @Column('simple-array', { nullable: true })
  friends: number[];

  @Column('simple-array', { nullable: true })
  banlist: number[];

  @Column('simple-array', { nullable: true })
  History: string[];

  @Column('simple-array', { nullable: true })
  channels: string[];
  //Channels
}