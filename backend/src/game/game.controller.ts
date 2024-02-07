import { Controller, Get, Param, Post, Body, BadRequestException, Query, Req, Res } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
// Import additional DTOs as needed
import { UserService } from 'src/user/user.service';
import { GameService } from './game.service';


@Controller('Game')
export class GameController {
    constructor(private readonly GameService: GameService, private readonly userService: UserService) {
      // Inject other services if needed
    }


}