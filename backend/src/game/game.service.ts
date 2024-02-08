import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Game } from 'src/entities/game.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class GameService {
  constructor(
    private userService: UserService,
    @InjectRepository(Game)
    private readonly GameRepository: Repository<Game>,
    
    // ... other dependencies
  ) {}

  async createGame(userAId: number, userBId: number): Promise<Game> {
    // Créez un nouveau jeu
    const game = new Game();
    game.userA = userAId;
    game.userB = userBId;
    game.scoreA = 0;
    game.scoreB = 0;
    
    // Enregistrez le jeu dans la base de données
    const newGame = await this.GameRepository.save(game);

    // const playerAPosition = { y: 200 };
    // const playerBPosition = { y: 200 };
    // newGame.playerAPosition = playerAPosition;
    // newGame.playerBPosition = playerBPosition;

    // Mettez à jour l'entité User pour chaque utilisateur avec l'ID de la partie
    await this.updateUserGameHistory(userAId, newGame.id);
    await this.updateUserGameHistory(userBId, newGame.id);

    return newGame;
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

  async getGameById(gameId: number): Promise<Game | undefined> {
    const game = await this.GameRepository.findOne({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found`);
    }
    return game;
  }
}