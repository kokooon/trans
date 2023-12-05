import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from './auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: 'FORTYTWO_APP_ID',
      clientSecret: 'FORTYTWO_APP_SECRET',
      callbackURL: 'http://127.0.0.1:3000/auth/42/callback',
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
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
    // Use the profile information to find or create a user in your database
    const user = await this.authService.findOrCreateUser(profile.id, profile);
    done(null, user);
  }
}
