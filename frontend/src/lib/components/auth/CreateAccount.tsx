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

  const handleCreateAccount = async () => {
    try {
      // Remplacez 'VOTRE_POINT_ENDPOINT_API' par votre point d'API réel
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pseudo, password }),
      });

      if (response.ok) {
        // Gérer le succès, par exemple, afficher un message de réussite ou rediriger
        console.log('Compte créé avec succès !');
      } else {
        // Gérer les erreurs, par exemple, afficher un message d'erreur
        console.error('Erreur lors de la création du compte');
      }
    } catch (error) {
      console.error('Erreur :', error);
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
        <Button className="w-full" onClick={handleCreateAccount}>Se connecter</Button>
      </CardFooter>
    </Card>
  );
}
