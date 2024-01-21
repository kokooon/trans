// user.controller.ts
import { Controller, Get, Param, Post, Body, BadRequestException, Query, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth-42/auth.service';
//import { ChangePseudoDto } from './dto/change-pseudo.dto';
import { Request, Response } from 'express';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

    //social
    @Get('getId/:pseudo')
    async findidByPseudo(@Param('pseudo') pseudo: string, @Req() req, @Res() res): Promise<Number | void> {
		console.log('pseudo = ', pseudo);
    	const id = await this.userService.findIdByPseudo(pseudo);
    	if (id)
			return res.status(201).json(id);
		else
			return res.status(409).json({ error: 'can\'t find id' });

    }

    //social
    @Post('/channel/AddInUser')
    async AddChannelId(@Req() req, @Res() res) {
    try {
        const userId = req.body.userId;
        if (isNaN(userId)) {
            return res.status(500).send('invalid userId');
        }
        const user = await this.userService.findById(userId);
        await this.userService.addChannelId(req.body.channelId, user);
        return res.status(200).json({ status: 'success' });
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
          await this.userService.AddInFriendRequest(userId, FriendId);
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
    async findPseudoById(@Param('userId') userId: number): Promise<string> {
      const user = await this.userService.findById(userId);
      return user.pseudo;
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
        const userId = req.body.userId;
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

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
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
