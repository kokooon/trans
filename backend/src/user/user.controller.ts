// user.controller.ts
import { Controller, Get, Param, Post, Body, BadRequestException, Query, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth-42/auth.service';
//import { ChangePseudoDto } from './dto/change-pseudo.dto';
import { Request, Response } from 'express';
import { findUserById } from '../entities/socket.map';
import { getSocketIdByUserId } from '../entities/socket.map';

type UserStatus = "available" | "unavailable" | "away" | "dnd" | "invisible" | "eager";

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('gameNotif')
  async addInvit(@Req() req, @Res() res) {
		console.log('in invite');
		await this.userService.addGameNotif(req.body.userId, req.body.inviteRecipientId)
		return res.status(201).json();
  }

  @Get('getPseudo/:id')
  async findPseudoByid(@Param('id') id: number, @Req() req, @Res() res): Promise<string> {
    const pseudo = await this.userService.findPseudoById(id);
    if (pseudo)
    return res.status(201).json(pseudo);
  else
    return res.status(409).json({ error: 'can\'t find id' });
  }

	@Get('getSocket/:userId')
	async findSocketById(@Param('userId') userId: number, @Req() req, @Res() res): Promise<string | void> {
    	const userSocket = getSocketIdByUserId(userId);
		if (userSocket)
			return res.status(201).json(userSocket);
		else
			return res.status(409).json({ error: 'can\'t find id' });
    }

    @Get('getBlocked/:userId')
    async getBlockedUsers(@Param('userId') userId: number, @Req() req, @Res() res): Promise<number[] | void> {
      const user = await this.userService.findById(userId);
      if (user){
        return res.status(201).json(user.banlist);
      }
      else {
        return res.status(404).json('cant fetch user in getBlocked/:userId');
      }
    }

    //social
    @Get('getId/:pseudo')
    async findidByPseudo(@Param('pseudo') pseudo: string, @Req() req, @Res() res): Promise<Number | void> {
    	const id = await this.userService.findIdByPseudo(pseudo);
    	if (id)
			return res.status(201).json(id);
		else
			return res.status(409).json({ error: 'can\'t find id' });
    }

    @Post('leaveChannel')
    async leaveChannel(@Req() req) {
		const user = await this.userService.findById(req.body.kickId);
		try {
			await this.userService.leaveChannel(user, req.body.channelId)
		}catch(error){
			console.log('failed to remove channel id in user leave post');
		}
    }

    //social
    @Post('channel/AddInUser')
    async AddChannelId(@Req() req, @Res() res) {
    try {
        const userIds = Array.isArray(req.body.userId) ? req.body.userId : [req.body.userId];
      for (const userId of userIds) {
        if (isNaN(userId)) {
            return res.status(500).send('invalid userId');
        }
        const user = await this.userService.findById(userId);
        await this.userService.addChannelId(req.body.channelId, user);
        }
        return res.status(201).json({
          status: 'success',
          message: 'Channel added successfully',
        });
      } catch (error) {
        console.error('Error adding channel:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to add channel',
        });
      }
  }

    //social
    @Post('social/unblock')
    async unblockUser(@Req() req, @Res() res) {
      try {
          const userId = req.body.userId
          if (isNaN(userId)) {
              return res.status(500).send('invalid userId');
          }
          const pseudo = req.body.unblockpseudo;
          if (!pseudo) {
              return res.status(400).send('no pseudo provided');
          }
          await this.userService.unblockUser(userId, pseudo);
          return res.status(200).json({ status: 'success' });
      } catch (error) {
          console.log('Error unblocking user:', error);
          return res.status(500).json({
              status: 'error',
              message: 'Failed to block user',
          });
      }
    }

    //social
    @Post('Block')
    async blockUser(@Req() req, @Res() res) {
      try {
          const userId = req.body.userId
          if (isNaN(userId)) {
              return res.status(500).send('invalid userId');
          }
          const pseudo = req.body.blockpseudo;
          if (!pseudo) {
              return res.status(400).send('no pseudo provided');
          }
          await this.userService.blockUser(userId, pseudo);
          return res.status(200).json({ status: 'success' });
      } catch (error) {
          console.error('Error blocking user:', error);
          return res.status(500).json({
              status: 'error',
              message: 'Failed to block user',
          });
      }
    }

    //social
    @Post('RefuseFriend')
    async RefuseFriend(@Req() req, @Res() res) {
      try {
          const userId = req.body.userId
          if (isNaN(userId)) {
              return res.status(500).send('invalid userId');
          }
          const RequestPseudo = req.body.friendPseudo;
          if (!RequestPseudo) {
              return res.status(400).send('no new pseudo provided');
          }
          await this.userService.RefuseFriend(userId, RequestPseudo);
          return res.status(200).json({ status: 'success' });
      } catch (error) {
          console.error('Error changing pseudo:', error);
          return res.status(500).json({
              status: 'error',
              message: 'Failed to change pseudo',
          });
      }
    }

    //social
    @Post('AcceptFriend')
    async AcceptFriend(@Req() req, @Res() res) {
      try {
          const userId = req.body.userId;
          if (isNaN(userId)) {
              return res.status(500).send('invalid userId');
          }
          const NewFriendPseudo = req.body.friendPseudo;
          if (!NewFriendPseudo) {
              return res.status(400).send('no new pseudo provided');
          }
          await this.userService.updateFriend(userId, NewFriendPseudo);
          return res.status(200).json({ status: 'success' });
      } catch (error) {
          console.error('Error changing pseudo:', error);
          return res.status(500).json({
              status: 'error',
              message: 'Failed to change pseudo',
          });
      }
    }

    //social
    @Post ('Unfriend')
    async Unfriend(@Req() req, @Res() res) {
      try {
          const userId = req.body.userId;
          if (isNaN(userId)) {
              return res.status(500).send('invalid userId');
          }
          const UnFriend = req.body.friendName;
          const FriendId = await this.userService.findIdByPseudo(UnFriend);
          await this.userService.unfriend(userId, FriendId);
          return res.status(200).json({ status: 'success' });
      }catch (error) {
        console.error('Error unfriend:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to unriend',
        });
    }
  }

    //social
    @Post('FriendRequest')
    async FriendRequest(@Req() req, @Res() res) {
      try {
          const userId = req.body.userId;
          if (isNaN(userId)) {
              return res.status(500).send('invalid userId');
          }
          const addFriend = req.body.addFriend;
          if (!addFriend)
            return res.status(400).send('no valide friend name');
          const FriendId = await this.userService.findIdByPseudo(addFriend);
          if (!FriendId)
            return res.status(400).send('no friend');
          await this.userService.SetNotifications(userId, FriendId);
          return res.status(200).json({ status: 'success' });
      } catch (error) {
          console.error('Error adding friend:', error);
          return res.status(500).json({
              status: 'error',
              message: 'Failed to add friend',
          });
      }
    }

    //social
    @Get('friends/:userId') // Définissez le paramètre dans l'URL comme ":userId"
    async findPseudoById(@Param('userId') userId: number): Promise<any> {
      try {
        const user = await this.userService.findById(userId);
        if (user) {
          const friendSocketId = getSocketIdByUserId(Number(userId));
            if (friendSocketId) {
              const friend = {
                id: user.id,
                pseudo: user.pseudo,
                avatar: user.avatar,
                status: 'available' // Assuming default status is false
              };
              return friend;
            }
            else {
              const friend = {
                id: user.id,
                pseudo: user.pseudo,
                avatar: user.avatar,
                status: 'unavailable' // Assuming default status is false
              };
              return friend;
            }
        } else {
          return 'User not found or missing pseudo';
        }
      } catch (error) {
        console.error('Error finding user by ID:', error);
        return 'Error finding user by ID';
      }
    }

    //end of social call
  @Post('changeAvatar')
  async changeAvatar(@Req() req, @Res() res) {
    try {
        const userId = req.body.userId;
        if (isNaN(userId)) {
            return res.status(500).send('invalid userId');
        }
        const newAvatar = req.body.avatarUrl;
        if (!newAvatar) {
            return res.status(400).send('no new pseudo provided');
        }
        await this.userService.updateAvatar(userId, newAvatar);
        return res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error('Error changing pseudo:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to change pseudo',
        });
    }
  }

  @Post('logout')
  async logout(@Req() req, @Res() res) {
    try {
      res.clearCookie('jwt');
      await this.userService.validate2FA(req.body.userId, false);
      return res.status(200).json({ status: 'success', message: 'Logout successful' });
    } catch (error) {
      console.error('Error during logout:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to logout',
      });
    }
  }

  @Post('changePseudo')
  async changePseudo(@Req() req, @Res() res) {
    try {
        //console.log('userid = ', req.body.newPseudo);
        const jwtCookie = req.cookies.jwt;
        const decodedData = await this.authService.verifyJwtCookie(jwtCookie);
        if (decodedData === null)
          return null;
        const userId = parseInt(decodedData.userId, 10);
        if (isNaN(userId)) {
            return res.status(500).send('invalid userId');
        }
        const newPseudo = req.body.newPseudo;
        if (!newPseudo) {
            return res.status(400).send('no new pseudo provided');
        }
        await this.userService.updatePseudo(userId, newPseudo);
        return res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error('Error changing pseudo:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to change pseudo',
        });
    }
  }

  @Get('cookie')
  async findbyId(@Req() req): Promise<User[]> {
    try {
      const jwtCookie = req.cookies.jwt;
      const decodedData = await this.authService.verifyJwtCookie(jwtCookie);
      if (decodedData === null)
        return null;
      const userId = parseInt(decodedData.userId, 10);
      if (!isNaN(userId)) {
        const User = await this.userService.findById(userId);
        return [User];
      } else {
        throw new BadRequestException('Invalid userId');
      }
    } catch (error) {
      console.error('Error processing JWT cookie:', error);
      throw new BadRequestException('Invalid JWT token');
    }
  }

  @Get('allIds')
  async findAllIds(@Req() req, @Res() res): Promise<number[] | void> {
    const Ids = await this.userService.findAllIds();
    res.status(201).json(Ids);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('check/socket')
  async checkSocket(@Req() req, @Res() res) {
	try {
		const jwtCookie = req.cookies.jwt;
		const decodedData = await this.authService.verifyJwtCookie(jwtCookie);
		const userid = parseInt(decodedData.userId, 10);
		const user = await this.userService.checkById(userid);
		if (user) {
			if (findUserById(userid)) {
				res.status(404).json({ userId: userid });
			}
			else {
				res.status(201).json({ userId: userid });
			}
		} else {
			res.status(404).send("no token/no socket");
		}
  	}catch (error) {
		console.error('Error processing socket in map:', error);
		res.status(500).json({ isValid: false });
	  }
}

  @Get('check')
  async checkId(@Req() req, @Res() res) {
    try {
      const jwtCookie = req.cookies.jwt;
      if (!jwtCookie || jwtCookie === undefined)
      {
        res.status(404).send("no token");
        return;
      }
      const decodedData = await this.authService.verifyJwtCookie(jwtCookie);
      if (!decodedData) {
        res.status(404).send("no token");
        return;
      }
      const userid = parseInt(decodedData.userId, 10);
      if (!isNaN(userid)) {
        const user = await this.userService.checkById(userid);
        if (user) {
          res.status(200).json({ userId: userid });
        } else {
        	res.status(404).send("no token");
        }
      } else {
        res.status(404).send("no token");
      }
    } catch (error) {
      console.error('Error processing JWT cookie:', error);
      res.status(500).json({ isValid: false });
    }
  }

  @Get('check_conection')
  async checkConnected(@Req() req, @Res() res) {
    try {
      const jwtCookie = req.cookies.jwt;
      if (!jwtCookie || jwtCookie === undefined) {
        res.status(404).send("no token");
        return;
      }
      const decodedData = await this.authService.verifyJwtCookie(jwtCookie);
      if (!decodedData) {
        res.status(404).send("no token");
        return;
      }
      const userId = parseInt(decodedData.userId, 10);
      if (!isNaN(userId)) {
        const user = await this.userService.checkById(userId);
        if (user) {
          const check = await this.userService.checkConnectedById(userId);
          if (check)
            res.status(200).json({ userId });
          else
            res.status(404).send("not connected");
          }
      } else {
        res.status(404).send("no token");
      }
    } catch (error) {
      console.error('Error processing JWT cookie:', error);
      res.status(500).json({ isValid: false });
    }
  }

  @Get(':pseudo')
  async findByPseudo(@Param('pseudo') pseudo: string) {
    return this.userService.findByPseudo(pseudo);
  }

  @Get(':pseudo/avatar') // Nouvelle route pour obtenir l'avatar
  async getAvatar(@Param('pseudo') pseudo: string) {
    const base64Avatar = await this.userService.getAvatar(pseudo);

    if (base64Avatar) {
      return { avatar: base64Avatar };
    } else {
      return { message: 'Avatar not found' };
    }
  }

  @Post()
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      if (!createUserDto.pseudo || !createUserDto.password) {
        throw new BadRequestException('Pseudo and password are required.');
      }
      const existingUser = await this.userService.findByPseudo(createUserDto.pseudo);
      if (existingUser) {
        throw new BadRequestException('Pseudo already exists. Choose another pseudo.');
      }
      return this.userService.add_user(createUserDto.pseudo, createUserDto.password, createUserDto.email, createUserDto.avatar);
    } catch (error) {
      throw new BadRequestException('Invalid request body.');
    }
  }

  @Post('check-login')
  async checkLogin(@Body() loginUserDto: LoginUserDto): Promise<{ valid: boolean }> {
    try {
      if (!loginUserDto.pseudo || !loginUserDto.password) {
        throw new BadRequestException('Pseudo and password are required.');
      }
      const isValid = await this.userService.checkLogin(loginUserDto.pseudo, loginUserDto.password);
      return { valid: isValid };
    } catch (error) {
      throw new BadRequestException('Invalid request body.');
    }
  }

  @Post('update-2fa') // Nouvelle route pour la mise à jour du 2FA
  async update2FA(@Req() req: Request, @Res() res: Response) {
    try {
      const jwtCookie = req.cookies.jwt;
      if (!jwtCookie || jwtCookie === undefined) {
        return res.status(500).send('no token');
      }
      const decodedData = await this.authService.verifyJwtCookie(jwtCookie);
      if (!decodedData || !decodedData.userId) {
        return res.status(500).send('invalid token');
      }
      const userId = parseInt(decodedData.userId, 10);
      if (isNaN(userId)) {
        return res.status(500).send('invalid userId');
      }
      const is2FAEnabled = req.body.is2FAEnabled;
      if (is2FAEnabled === undefined) {
        return res.status(400).send('is2FAEnabled not provided');
      }
      await this.userService.update2FA(userId, is2FAEnabled);
      return res.status(200).json({ status: 'success' });
    } catch (error) {
      console.error('Error updating 2FA:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update 2FA',
      });
    }
  }

}
