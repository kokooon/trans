import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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


  //Channels
}