//user.controller.ts
import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // BODY
  // post/get/.. ({username: "Jackie", email:"a@b.c"})

  // REQUEST (REQ)
  // post/get/.. -> (body: {...}, headers: {...}, cookies: {...}, protocole: ..., <...>)

  @Post()
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      if (!createUserDto.pseudo || !createUserDto.password) {
        throw new BadRequestException('Username and email are required.');
      }
      return this.userService.add_user(createUserDto.pseudo, createUserDto.password);
    } catch (error) {
      throw new BadRequestException('Invalid request body.');
    }
  }
}
