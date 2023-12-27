import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLogin(@Req() req, @Res() res) {
    console.log('Reached /auth/42 endpoint');
    res.redirect('http://127.0.0.1:3000/private');
    // Ce point de terminaison redirigera l'utilisateur vers la stratégie 42 pour l'authentification
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLoginCallback(@Req() req, @Res() res: any) {
    try {
      const user = req.user;
  
      if (!user || !user.pseudo) {
        throw new Error('Invalid user data');
      }
      const jwtToken = this.authService.getJwtToken();

      res.cookie('jwt', jwtToken, { httpOnly: true, path: '/' });
  
      // Redirect the user to the desired page
      res.redirect('http://127.0.0.1:3000/');
    } catch (error) {
      console.error('Error processing user details:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}
