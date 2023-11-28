import { useState } from 'react';
import { Icons } from "@/lib/components/ui/icone";
import { Button } from "@/lib/components/ui/button";
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

export function CreateAccount() {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreateAccount = async () => {
    try {
      // Vérifier si le pseudo existe déjà dans la base de données
      const checkResponse = await fetch(`http://localhost:3001/users/check?pseudo=${pseudo}`, {
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
      }

      // Le pseudo n'existe pas, créer le compte
      const createResponse = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pseudo, password }),
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
        setError(null);
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
          <Button variant="outline" className="">
            <Icons.gitHub className="mr-2 h-4 w-4" />
            42 Auth
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
