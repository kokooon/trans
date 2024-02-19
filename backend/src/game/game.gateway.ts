import { WebSocketGateway, OnGatewayConnection, SubscribeMessage, WebSocketServer, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { addUserSocketPair, getSocketIdByUserId, removeUserSocketPair } from '../entities/socket.map';
import { GameData } from './gameData';
import { GameInstance } from './gameInstance';
import { getUserIdBySocketId } from '../entities/socket.map';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private matchmakingQueue: string[] = [];
  private gameData: Map<number, GameData> = new Map<number, GameData>();

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket, ...args: any[]) {
  }  
  
  @SubscribeMessage('matchmaking:request')
  async handleMatchmaking(client: Socket): Promise<void> {
      console.log('Matchmaking request received from', client.id);
      
      if (this.matchmakingQueue.includes(client.id)) {
          console.log('Player is already in the matchmaking queue.');
          return;
      }
    
      this.matchmakingQueue.push(client.id);
      console.log(this.matchmakingQueue);
  
      if (this.matchmakingQueue.length >= 2) {
          const [playerOne, playerTwo] = this.matchmakingQueue.splice(0, 2);
        
          this.server.to(playerOne).emit('matchmaking:found');
          this.server.to(playerTwo).emit('matchmaking:found');
        
          console.log(`Match found between ${playerOne} and ${playerTwo}`);
    
          const userIdOne = getUserIdBySocketId(playerOne);
          const userIdTwo = getUserIdBySocketId(playerTwo);

          const userOneS = getSocketIdByUserId(userIdOne);
          const userTwoS = getSocketIdByUserId(userIdTwo); 
        
          if (userIdOne && userIdTwo) {
              try {
                  const newGame = await this.gameService.createGame(userIdOne, userIdTwo);
                  this.gameData.set(newGame.game.id, newGame);
                  console.log('data0 = ', newGame);
                  
                  this.server.to(userOneS).emit('game:created', newGame);
                  this.server.to(userTwoS).emit('game:created', newGame);
  
                  const updateResult = await newGame.gameinstance.startGameLoop(userOneS, userTwoS, this.server);
                  if (updateResult.ballMissed === true)
                  {
                    if (updateResult.playerIdMissed === 1)
                    {
                        console.log('Joueur B a marque un point');
                        this.gameService.updatescore(false, true, newGame.game.id);
                        this.server.to(userOneS).emit('update:B_scored');
                        this.server.to(userTwoS).emit('update:B_scored');
                        
                    }
                    else if (updateResult.playerIdMissed === 2)
                        this.gameService.updatescore(true, false, newGame.game.id);
                        console.log('Joueur A a marque un point');
                        this.server.to(userOneS).emit('update:A_scored');
                        this.server.to(userTwoS).emit('update:A_scored');

                  }
              } catch (error) {
                  console.error('Error creating game:', error);
              }
          } else {
              console.error('User IDs not found for players:', playerOne, playerTwo);
          }
      } else {
          this.server.to(client.id).emit('matchmaking:searching');
      }
  }
  
  @SubscribeMessage('keydown')
  async handleKeyDown(client: Socket, data: { key: string }) {
      console.log('Key down:', data);
      const userId = getUserIdBySocketId(client.id);
      if (!userId) {
          console.error('User ID not found for client:', client.id);
          return;
      }

      let gameId: number | undefined;
      for (const [id, gameData] of this.gameData.entries()) {
          if (gameData.game.userA === userId || gameData.game.userB === userId) {
              gameId = id;
              break;
          }
      }
      if (!gameId) {
          console.error('Game ID not found for client:', client.id);
          return;
      }
  
      const gameData = this.gameData.get(gameId);
  
      if (!gameData) {
          console.error('Game instance not found for user:', userId);
          return;
      }
      
      try {
          const game = gameData.game;
          const gameInstance = gameData.gameinstance;
          if (!gameInstance) {
              console.error('Game not found for user:', userId);
              return;
          }
          if (data.key === 'ArrowUp') {
              if (userId === game.userA) {
                  gameInstance.moveupA = true;
              } else if (userId === game.userB) {
                  gameInstance.moveupB = true;
              }
          } else if (data.key === 'ArrowDown') {
              if (userId === game.userA) {
                  gameInstance.movedownA = true;
              } else if (userId === game.userB) {
                  gameInstance.movedownB = true;
              }
          }
      } catch (error) {
          console.error('Error:', error);
      }
  }
  
@SubscribeMessage('keyup')
handleKeyUp(client: Socket, data: { key: string }) {
    console.log('Key down:', data);
    const userId = getUserIdBySocketId(client.id);
    if (!userId) {
        console.error('User ID not found for client:', client.id);
        return;
    }
    
    let gameId: number | undefined;
    for (const [id, gameData] of this.gameData.entries()) {
        if (gameData.game.userA === userId || gameData.game.userB === userId) {
            gameId = id;
            break;
        }
    }
    if (!gameId) {
        console.error('Game ID not found for client:', client.id);
        return;
    }

    const gameData = this.gameData.get(gameId);

    if (!gameData) {
        console.error('Game instance not found for user:', userId);
        return;
    }
    try {
      const game = gameData.game;
      const gameInstance = gameData.gameinstance;
      if (!gameInstance) {
          console.error('Game not found for user:', userId);
          return;
      }
      if (data.key === 'ArrowUp') {
          if (userId === game.userA) {
              gameInstance.moveupA = false;
          } else if (userId === game.userB) {
              gameInstance.moveupB = false;
          }
      } else if (data.key === 'ArrowDown') {
          if (userId === game.userA) {
              gameInstance.movedownA = false;
          } else if (userId === game.userB) {
              gameInstance.movedownB = false;
          }
      }
    } catch (error) {
        console.error('Error:', error);
    }
}

async handleDisconnect(client: Socket) {
    //console.log(`ici 1`);
    const index = this.matchmakingQueue.indexOf(client.id);
    if (index !== -1) {
        this.matchmakingQueue.splice(index, 1);
        console.log(`Socket ${client.id} disconnected and removed from matchmaking queue.`);
    } else {
        console.log(`Socket ${client.id} disconnected.`);
    }
    //console.log(`ici 2`);
    let gameId: number | undefined;
    for (const [id, gameData] of this.gameData.entries()) {
        if (gameData.socketA === client.id || gameData.socketB === client.id) {
            gameId = id;
            break;
        }
    }

    if (gameId !== undefined) {
        console.log(`Game found for disconnected client: gameId ${gameId}`);
        const gameData = this.gameData.get(gameId);

        if (gameData) {
            const gameInstance = gameData.gameinstance;
            if (gameInstance) {
                // Envoi de l'événement "opponentLeft" à l'autre joueur avant de supprimer les données de jeu
                const otherUserId = gameData.socketA === client.id ? gameData.socketB : gameData.socketA;
                if (otherUserId) {
                    this.server.to(otherUserId).emit('opponentLeft');
                    console.log(`Event 'opponentLeft' sent to user ${otherUserId}.`);
                }

                gameInstance.stopGameLoop();
                console.log(`Game loop stopped for user ${client.id}.`);
            }
            this.gameData.delete(gameId);
            console.log(`GameData removed for user ${client.id}.`);
        }
    } else {
        console.log(`No game found for disconnected client.`);
    }
    }
}
