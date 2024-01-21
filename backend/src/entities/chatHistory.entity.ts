import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class chatHistory {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('text')
  	messages: string;

	@Column({ nullable: true })
	user1Id?: number; // User ID for private chats
	
	@Column({ nullable: true })
	user2Id?: number; // User ID for private chats
	
	@Column({ nullable: true })
	channelId?: number; // Channel ID for channel chats

	//@Column('text', { nullable: true })
	//content: string[]; //{'gmarzull: content, bschweit: content}
}