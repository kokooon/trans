import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  pseudo: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true }) // or however you want to define this column
  fortytwoId: string;
}