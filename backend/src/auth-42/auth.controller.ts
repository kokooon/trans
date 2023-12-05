import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLogin() {
    // Ce point de terminaison redirigera l'utilisateur vers la stratégie 42 pour l'authentification
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLoginCallback(@Req() req, @Res() res) {
    // Ce point de terminaison sera appelé après l'authentification 42
    // Vous pouvez ajouter ici une logique personnalisée si nécessaire
    res.redirect('/'); // Redirigez l'utilisateur vers la page principale après l'authentification
  }
}
