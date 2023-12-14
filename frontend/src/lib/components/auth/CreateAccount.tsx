import { useState } from 'react';
import { Button } from "@/lib/components/ui/button";
//import { Icons } from "@/lib/components/ui/icone";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export function CreateAccount() {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [, setCookies] = useCookies(['userToken', 'userPseudo']);
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    try {
      // Vérifier si le pseudo existe déjà dans la base de données
      /*const checkResponse = await fetch(`http://localhost:3001/users/check?pseudo=${pseudo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const checkData = await checkResponse.json();

      if (checkData.exists) {
        setError('Le pseudo existe déjà. Choisissez un autre pseudo.');
        setSuccess(null);
        return;
      }*/

      // Le pseudo n'existe pas, créer le compte
      const avatar = "https://cdn.intra.42.fr/users/92731bef5d53f8af1ed11fd026274345/gmarzull.jpg";
      const email = "test@gmail.com";
      const createResponse = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pseudo, password, email, avatar}),
      });

      if (createResponse.ok) {
        setSuccess('Compte créé avec succès !');
        setError(null);
      } else {
        setError('Erreur lors de la création du compte. Veuillez réessayer.');
        setSuccess(null);
      }
    } catch (error) {
      console.error('Erreur :', error);
      setError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
      setSuccess(null);
    }
  };

  const handleLogin = async () => {
    try {
      // Vérifier si le pseudo et le mot de passe correspondent
      const response = await fetch(`http://localhost:3001/users/check-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pseudo, password }),
      });
      const data = await response.json();

      if (data.valid) {
        setSuccess('Connexion réussie !');
        setCookies('userToken', '532523532532', { path: '/' });
        setCookies('userPseudo', pseudo, { path: '/' });
        setError(null);
        navigate('/');
      } else {
        setError('Pseudo ou mot de passe incorrect. Veuillez réessayer.');
        setSuccess(null);
      }
    } catch (error) {
      console.error('Erreur :', error);
      setError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
      setSuccess(null);
    }
  };

  // const handleLoginClick = async () => {
  //   try {
  //     const response = await fetch('http://127.0.0.1:3001/auth/42', {
  //       method: 'GET',
  //       // Ajoutez des en-têtes ou des paramètres de requête si nécessaire
  //     });

  //     if (response.ok) {
  //       // La requête a réussi, effectuez des actions supplémentaires si nécessaire
  //       console.log('Login success!');
  //     } else {
  //       // La requête a échoué, gérez les erreurs
  //       console.error('Login failed:', response.status, response.statusText);
  //     }
  //   } catch (error) {
  //     // Gérez les erreurs liées à la requête
  //     console.error('Error during login:', error);
  //   }
  // }

  'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-98088ec7c5a8476034256f4a4b1d02b3d6d8c2f7fac969cccb5641cb4a6349b4&redirect_uri=http%3A%2F%2F127.0.0.1%3A3001%2Fauth%2F42%2Fcallback&response_type=code'

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Bienvenue</CardTitle>
        <CardDescription>
          Connecte-toi ou crée ton compte avec un pseudo unique
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex justify-center">
        <Button variant="outline" onClick={() => window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-98088ec7c5a8476034256f4a4b1d02b3d6d8c2f7fac969cccb5641cb4a6349b4&redirect_uri=http%3A%2F%2F127.0.0.1%3A3001%2Fauth%2F42%2Fcallback&response_type=code'}>
            <img src='../../../../assets/Final-sigle-seul.svg' className="mr-2 w-10 h-10" />
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              OU CONTINUE AVEC
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pseudo">Pseudo</Label>
          <Input
            id="pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleCreateAccount}>
          Créer un compte
        </Button>
      </CardFooter>
      <CardFooter>
        <Button className="w-full" onClick={handleLogin}>Se connecter</Button>
      </CardFooter>
      {success && (
        <div className="text-green-500 mt-4">
          {success}
        </div>
      )}
      {error && (
        <div className="text-red-500 mt-4">
          {error}
        </div>
      )}
    </Card>
  );
}
