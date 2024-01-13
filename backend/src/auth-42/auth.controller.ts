import { Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,  // Injectez le service UserService ici
  ) {}
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

      if (user.is2FAEnabled)
        return res.redirect('/auth/verification-page');
      res.cookie('jwt', jwtToken, { httpOnly: true, path: '/' });
      // Redirect the user to the desired page
      res.redirect('http://127.0.0.1:3000/');
    } catch (error) {
      console.error('Error processing user details:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  @Get('verification-page')
  // Cette route gérera la vérification du code 2FA
  async showVerificationPage(@Req() req, @Res() res) {
    // Afficher la page de vérification où l'utilisateur peut entrer son code 2FA
    res.render('verification-page');  // Assurez-vous d'avoir une vue associée à la vérification
  }

  @Get('enable-2fa')
  @UseGuards(AuthGuard('42'))
  async enableTwoFactorAuth(@Req() req, @Res() res: any) {
    try {
      const user = req.user;

      if (!user || !user.pseudo) {
        throw new Error('Invalid user data');
      }

      // Générer une clé secrète pour l'utilisateur
      const { base32: otpSecret, otpauth_url } = speakeasy.generateSecret({
        name: 'YourApp',  // Nom de votre application pour le code OTP
      });

      // Stocker la clé secrète otpSecret associée à l'utilisateur dans votre base de données
      const secret = await this.userService.addSecret(user.id, otpSecret);

      // Générer le code QR
      const qrCodeUrl = await QRCode.toDataURL(otpauth_url);

      // Passer le secret OTP à la vue (ou à l'endroit approprié dans votre frontend)
      res.render('enable-2fa', { qrCodeUrl, otpSecret: secret.otpSecret });
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      res.status(500).send('Internal Server Error');
    }
  }


  @Post('verify-2fa')
  async verifyTwoFactorAuth(@Req() req, @Res() res) {
    try {
      const user = req.user;

      // Obtenez le code 2FA à partir du corps de la requête
      const twoFactorCode = req.body.twoFactorCode;

      const isValid2FACode = speakeasy.totp.verify({
        secret: user.otpSecret,
        encoding: 'base32',
        token: twoFactorCode,
      });

      if (isValid2FACode) {
        // Le code 2FA est valide, effectuez les actions nécessaires
        // (par exemple, générer un jeton JWT et le renvoyer au client)
        const jwtToken = this.authService.getJwtToken();
        res.cookie('jwt', jwtToken, { httpOnly: true, path: '/' });

        res.status(200).send('Verification successful');
      } else {
        // Le code 2FA est invalide
        res.status(401).send('Invalid 2FA code');
      }
    } catch (error) {
      console.error('Error processing 2FA verification:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}
