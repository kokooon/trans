import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLogin() {
    console.log('Reached /auth/42 endpoint');
    // Ce point de terminaison redirigera l'utilisateur vers la stratégie 42 pour l'authentification
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLoginCallback(@Req() req, @Res() res) {
    // console.log('Reached /auth/42/callback endpoint');
    // Ce point de terminaison sera appelé après l'authentification 42
    //console.log("test1")
    //console.log("res",res)
    res.cookie('userToken', '532523532532', { httpOnly: false, path: '/' });
    // Vous pouvez ajouter ici une logique personnalisée si nécessaire
    res.redirect('http://127.0.0.1:3000/private'); // Redirigez l'utilisateur vers la page principale après l'authentification
  }
}
