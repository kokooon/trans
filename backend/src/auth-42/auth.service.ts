// auth-42/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async findOrCreateUser(fortytwoId: string, profile: any): Promise<any> {
      let user = await this.userService.findByFortyTwoId(fortytwoId);
  
      if (!user) {
        user = await this.userService.add_user(fortytwoId, profile.login);
        // You might want to include other fields from the profile in the creation process
      }
  
      return user;
    }
  }