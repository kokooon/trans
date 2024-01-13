import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Secret {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  otpSecret: string;
}
