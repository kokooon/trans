import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/find')
  // getHello(): string {
  // return this.appService.getHello();
  findAll(): string {
    return 'This action return all';
  }
}