// auth-42/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async findOrCreateUser(profile: any): Promise<any> {
      //console.log("coucou");
      let user = await this.userService.findByFortyTwoId(profile);
  
      if (!user) {
        //console.log("pas de user");
        user = await this.userService.add_user_42(profile);
        // You might want to include other fields from the profile in the creation process
      }
  
      return user;
    }
  }