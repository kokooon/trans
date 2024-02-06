import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userA: number;

  @Column()
  userB: number;

  @Column()
  scoreA: number;

  @Column()
  scoreB: number;
}