import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Game } from 'src/entities/game.entity';
import { NotFoundException } from '@nestjs/common';
import { Ball } from './ball';
import { GameData } from './gameData';
import { GameInstance } from './gameInstance';
import { getSocketIdByUserId } from 'src/entities/socket.map';

type Games = {
  winner: string,
  looser: string,
  scoreWinner: number,
  scoreLoser: number,
  AvatarWin: string,
  AvatarLoose: string

}

type History = {
  game: Games[]
}

@Injectable()
export class GameService {
  constructor(
    private userService: UserService,
    @InjectRepository(Game)
    private readonly GameRepository: Repository<Game>,
    
    // ... other dependencies
  ) {}

  async createGame(userAId: number, userBId: number): Promise<GameData> {
    // Créez un nouveau jeu
    const game = new Game();
    game.userA = userAId;
    game.userB = userBId;
    game.scoreA = 0;
    game.scoreB = 0;
    
    // Enregistrez le jeu dans la base de données
    const newGame = await this.GameRepository.save(game);

    const playerAPosition = { y: 200 };
    const playerBPosition = { y: 200 };
    const gameInstance = new GameInstance(newGame.id, playerAPosition, playerBPosition);

    await this.updateUserGameHistory(userAId, newGame.id);
    await this.updateUserGameHistory(userBId, newGame.id);

    const gameData = new GameData(game, gameInstance);
    return gameData;
}

async findGamesByUserId(userId: number): Promise<History | null> {
  const games = await this.GameRepository
    .createQueryBuilder('game')
    .where('game.userA = :userId OR game.userB = :userId', { userId })
    .getMany();

    if (games.length === 0) {
      return null;
    }

  const history: History = { game: [] };

  for (const game of games) {
    // Determine winner and loser
    let winnerId, loserId, scoreWinner, scoreLoser;
    if (game.scoreA > game.scoreB) {
      winnerId = game.userA;
      loserId = game.userB;
      scoreWinner = game.scoreA;
      scoreLoser = game.scoreB;
    } else {
      winnerId = game.userB;
      loserId = game.userA;
      scoreWinner = game.scoreB;
      scoreLoser = game.scoreA;
    }

    // Fetch pseudos for winner and loser
    const winnerPseudo = await this.userService.findPseudoById(winnerId);
    const loserPseudo = await this.userService.findPseudoById(loserId);
    const avatarWin = await this.userService.getAvatar(winnerPseudo);
    const avatarLoose = await this.userService.getAvatar(loserPseudo);

    const newGame: Games = {
      winner: winnerPseudo,
      looser: loserPseudo, // Note the typo: it should be 'loser', not 'looser'
      scoreWinner: scoreWinner,
      scoreLoser: scoreLoser,
      AvatarWin: avatarWin,
      AvatarLoose: avatarLoose,
    };

    history.game.push(newGame);
  }

  return history;
}

  async deleteGame(gameId: number) : Promise<void>{
    const game = await this.GameRepository.findOne({ where: { id: gameId } });
    if (game) {
        await this.GameRepository.remove(game);
        console.log(`Game with ID ${gameId} deleted successfully.`);
    } else {
        console.log(`Game with ID ${gameId} not found.`);
    }
  }

  async updateUserGameHistory(userId: number, gameId: number): Promise<void> {
    // Utilisez le service UserService pour obtenir l'utilisateur
    const user = await this.userService.findById(userId);

    // Vérifiez si l'utilisateur existe
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Ajoutez l'ID de la partie à l'historique des jeux de l'utilisateur
    if (!user.History) {
      user.History = [String(gameId)];
    } else {
      user.History.push(String(gameId));
    }

    // Enregistrez les modifications dans la base de données
    await this.userService.save(user);
  }

  async gain_exp(userId: number, exp: number): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    let newExp = user.exp + exp;
    if (newExp >= 100) {
        if (user.level === 20) {
            newExp = 100;
        } else {
            user.level += 1;
            newExp -= 100;
            user.exp = newExp;
            await this.userService.save(user);
        }
    } else {
        user.exp = newExp;
        await this.userService.save(user);
    }
}

  async updatescore(scoreA: number, scoreB: number, gameId: number) {
    try {
        const game = await this.getGameById(gameId);
        game.scoreA = scoreA;
        game.scoreB = scoreB;
        await this.GameRepository.save(game);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du score:', error);
    }
}

  async getGameById(gameId: number): Promise<Game | undefined> {
    const game = await this.GameRepository.findOne({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found`);
    }
    return game;
  }
}