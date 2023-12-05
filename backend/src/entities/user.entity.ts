import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pseudo: string;

  @Column()
  password: string;

  @Column({ nullable: true }) // or however you want to define this column
  fortytwoId: string;
}