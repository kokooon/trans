// user.controller.ts
import { Controller, Get, Post, Body, BadRequestException, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('check')
  async checkPseudo(@Query('pseudo') pseudo: string): Promise<{ exists: boolean }> {
    const existingUser = await this.userService.findByPseudo(pseudo);
    return { exists: !!existingUser };
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

      return this.userService.add_user(createUserDto.pseudo, createUserDto.password);
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
