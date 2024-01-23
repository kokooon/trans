import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  connectionCount: number;

  @Column({ nullable: true })
  pseudo: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @Column({ default: false })
  is2FAEnabled: boolean;

  @Column({ default: false })
  is2FAVerified: boolean;

  @Column('simple-array', { nullable: true })
  friendRequest: number[];

  @Column('simple-array', { nullable: true })
  friendNotif: number[];

  @Column('simple-array', { nullable: true })
  friends: number[];

  @Column('simple-array', { nullable: true })
  banlist: number[];

  @Column('simple-array', { nullable: true })
  History: string[];

  @Column('simple-array', { nullable: true })
  channels: number[];
  //Channels
}