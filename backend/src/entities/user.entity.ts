import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}