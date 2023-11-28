// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async add_user(pseudo: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { pseudo } } as FindOneOptions<User>);
    if (existingUser) {
      throw new BadRequestException('Username already exists.');
    }
    let user = new User;
    user.pseudo = pseudo;
    user.password = password;

    return this.userRepository.save(user); // ASYNC
  }
}
