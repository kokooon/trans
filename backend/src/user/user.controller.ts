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


  @Post('changeAvatar')
  async changeAvatar(@Req() req, @Res() res) {
    try {
      const jwtCookie = req.cookies.jwt;
      console.log("jwtCookie =", jwtCookie);
      if (!jwtCookie || jwtCookie === undefined) {
          return res.status(500).send('no token');
      }
      const decodedData = await this.authService.verifyJwtCookie(jwtCookie);
        console.log(decodedData);
        if (!decodedData || !decodedData.userId) {
            return res.status(500).send('invalid token');
        }
        const userId = parseInt(decodedData.userId, 10);
        if (isNaN(userId)) {
            return res.status(500).send('invalid userId');
        }
        console.log("user id = ", userId);
        // Extract newPseudo from the request body
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

  @Post('changePseudo')
  async changePseudo(@Req() req, @Res() res) {
    try {
        const jwtCookie = req.cookies.jwt;
        console.log("jwtCookie =", jwtCookie);
        if (!jwtCookie || jwtCookie === undefined) {
            return res.status(500).send('no token');
        }

        // Extract userId from the JWT token
        const decodedData = await this.authService.verifyJwtCookie(jwtCookie);
        console.log(decodedData);
        if (!decodedData || !decodedData.userId) {
            return res.status(500).send('invalid token');
        }

        const userId = parseInt(decodedData.userId, 10);
        if (isNaN(userId)) {
            return res.status(500).send('invalid userId');
        }
        console.log("user id = ", userId);
        // Extract newPseudo from the request body
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
        // Gérer le cas où userId n'est pas une chaîne représentant un nombre valide
        throw new BadRequestException('Invalid userId');
      }
      //const user = await this.userService.findById(decodedData.userId);

      //return [user]; // Assurez-vous d'ajuster cela en fonction de votre structure de code exacte
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

      const userId = parseInt(decodedData.userId, 10);
  
      if (!isNaN(userId)) {
        const user = await this.userService.checkById(userId);
  
        if (user) {
          res.status(200).send();
        } else {
          res.status(404).send("no token");
        }
      } else {
        // Gérer le cas où userId n'est pas une chaîne représentant un nombre valide
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
      // Si l'avatar est disponible, renvoyez-le en réponse
      return { avatar: base64Avatar };
    } else {
      // Si l'avatar n'est pas disponible, renvoyez une réponse appropriée
      return { message: 'Avatar not found' };
    }
  }

  @Post()
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      if (!createUserDto.pseudo || !createUserDto.password) {
        throw new BadRequestException('Pseudo and password are required.');
      }
      
      // Vérifier si le pseudo existe déjà
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

      // Vérifier si le pseudo et le mot de passe correspondent
      const isValid = await this.userService.checkLogin(loginUserDto.pseudo, loginUserDto.password);

      return { valid: isValid };
    } catch (error) {
      throw new BadRequestException('Invalid request body.');
    }
  }
}
