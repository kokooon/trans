// auth-42/auth.service.ts
import { Injectable, Res } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as jwt from 'jsonwebtoken';
import { MyConfigService } from '../config/myconfig.service';


@Injectable()
export class AuthService {
    private jwtToken: string;

    constructor(private readonly userService: UserService, readonly myConfigService: MyConfigService) {}

    async findOrCreateUser(profile: any): Promise<any> {
      let user = await this.userService.findByPseudo_42(profile.username);
  
      if (!user) {
        user = await this.userService.add_user_42(profile);
      }
      this.generateJwtCookie(user);

      return user;
    }

    private generateJwtCookie(user: any): string {
      try {
        this.jwtToken = jwt.sign({ userId: user.id }, this.myConfigService.get_env().jwt_secret, { expiresIn: '1d' });
        return this.jwtToken;
      } catch (error) {
        console.error('Error generating JWT token:', error);
        throw new Error('Failed to generate JWT token');
      }
    }

    getJwtToken(): string {
      return this.jwtToken;
    }

    async verifyJwtCookie(cookie: string): Promise<any> {
      try {
        //console.log(cookie);
        const decodedData = jwt.verify(cookie, this.myConfigService.get_env().jwt_secret);
        return decodedData;
      } catch (error) {
        //console.error('Error verifying JWT token:', error);
        return (null);
        //throw new Error('Failed to verify JWT token');
      }
    }
}