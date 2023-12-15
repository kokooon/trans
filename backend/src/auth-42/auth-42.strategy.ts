//auth.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from './auth.service';
import { MyConfigService } from 'src/config/myconfig.service';


@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService: AuthService, private readonly myConfigService: MyConfigService) {
    const apiKey = myConfigService.get_env().apiKey;
    const publicapiKey = myConfigService.get_env().publicapiKey;
    super({
      clientID: publicapiKey,
      clientSecret: apiKey,
      callbackURL: 'http://127.0.0.1:3001/auth/42/callback',
      /*
      profileFields: {
        'id': (profile) => String(profile.id),
        'username': 'login',
        'displayName': 'displayname',
        'name.familyName': 'last_name',
        'name.givenName': 'first_name',
        'profileUrl': 'url',
        'emails.0.value': 'email',
        'phoneNumbers.0.value': 'phone',
        'photos.0.value': 'image_url'
      },
      */
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    // Use the profile information to find or create a user in your database
    try
    {
      const user = await this.authService.findOrCreateUser(profile);
    return(user);
    }
    catch (error) {
      console.error('Error in validate method:', error);
      throw new UnauthorizedException();
    }
  }
}
