import { GameService } from './game.service';
import { Controller, Get, Param, Post, Body, BadRequestException, Query, Req, Res } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

type Games = {
    winner: string,
    looser: string,
    scoreWinner: number,
    scoreLoser: number
  }

type History = {
	game: Games[]
}

@Controller('games')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
  ) {}


  @Get('returnHistory/:id')
  async findGameHistoryByUserId(@Param('id') id: number, @Req() req, @Res() res): Promise<History | null> {
    console.log('inside game controller');
    try {
        const games = await this.gameService.findGamesByUserId(id);
        if (games)
            return res.status(201).json(games);
        else
            return res.status(500).json();
      } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
}