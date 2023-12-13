import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLogin(@Req() req, @Res() res) {
    console.log('Reached /auth/42 endpoint');
    res.redirect('http://127.0.0.1:3000/private');
    // Ce point de terminaison redirigera l'utilisateur vers la stratégie 42 pour l'authentification
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLoginCallback(@Req() req, @Res() res) {
    try {
      const user = req.user; // Assuming user information is available in the request object
  
      if (!user || !user.pseudo) {
        throw new Error('Invalid user data');
      }
  
      // Storing only the pseudo in the cookie
      res.cookie('userPseudo', user.pseudo, { httpOnly: false, path: '/' });
      res.cookie('userToken', '532523532532', { httpOnly: false, path: '/' });
  
      // Redirect the user to the desired page
      res.redirect('http://127.0.0.1:3000/private');
    } catch (error) {
      console.error('Error processing user details:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}
