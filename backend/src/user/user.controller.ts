// user.controller.ts
import { Controller, Get, Param, Post, Body, BadRequestException, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth-42/auth.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('cookie')
  async findbyId(@Req() req): Promise<User[]> {
    try {
      const jwtCookie = req.cookies.jwt;
      const decodedData = await this.authService.verifyJwtCookie(jwtCookie);
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

  // @Get('check')
  // async checkPseudo(@Query('pseudo') pseudo: string): Promise<{ exists: boolean }> {
  //   const existingUser = await this.userService.findByPseudo(pseudo);
  //   return { exists: !!existingUser };
  // }
  @Get('check')
  async checkId(@Req() req): Promise<Boolean> {
    try {
      const jwtCookie = req.cookies.jwt;
      const decodedData = await this.authService.verifyJwtCookie(jwtCookie);
      const userId = parseInt(decodedData.userId, 10);
      if (!isNaN(userId)) {
        const user = await this.userService.checkById(userId);
        if (user)
          return true;
      } else {
        // Gérer le cas où userId n'est pas une chaîne représentant un nombre valide
        console.error('Invalid userId:', decodedData.userId);
        return false;
      }
      //const user = await this.userService.findById(decodedData.userId);

      //return [user]; // Assurez-vous d'ajuster cela en fonction de votre structure de code exacte
    } catch (error) {
      console.error('Error processing JWT cookie:', error);
      return false;
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
