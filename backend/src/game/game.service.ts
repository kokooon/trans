import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Game } from 'src/entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    private userService: UserService,
    @InjectRepository(Game)
    private readonly GameRepository: Repository<Game>,
    // ... other dependencies
  ) {}


}