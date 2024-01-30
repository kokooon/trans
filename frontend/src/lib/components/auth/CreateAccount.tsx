import { useEffect, useState} from 'react';
import { Button } from "@/lib/components/ui/button";
import { useNavigate } from 'react-router-dom'; // if you're using react-router for navigation
import { isTokenValid } from "@/lib/components/utils/UtilsFetch";
//import { useCookies } from 'react-cookie';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { fetchUserDetails } from '../../components/utils/UtilsFetch';

export function CreateAccount() {
  const navigate = useNavigate();
  const [, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const isValid = await isTokenValid();
      const userData = await fetchUserDetails();
      setUser(userData); 
      if (isValid && !userData[0].is2FAEnabled) { //si cookie valide et pas 2fa rediriger /home
        console.log("already login and no 2fa");
        navigate('/');
      } else if (isValid && userData[0].is2FAEnabled && !userData[0].is2FAVerified) { //si cookie valid et 2fa activer afficher qrcode
        navigate('/2fa');
        console.log("already login and 2fa enabled");
      }
      else if (isValid && userData[0].is2FAEnabled && userData[0].is2FAVerified) {
          navigate('/');
      }
    };
    fetchData();
  }, [navigate]);

  const checkToken = async () => {
      console.log("never login/or no cookie and no 2fa"); //si pas cookie/pas valide // 42 api // cree compte + donner cookie
      window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-1515023d756b04e8a366ce5ea86e9165d804a57f977124f5f6df1f54a76017a9&redirect_uri=http%3A%2F%2F127.0.0.1%3A3001%2Fauth%2F42%2Fcallback&response_type=code';
  
    // Further actions or rendering based on QR code URL can be handled here.
  };

  // Handler function for the onClick event
  const handleCreateAccountClick = () => {
    checkToken(); // This will check the token and handle QR code generation.
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Bienvenue</CardTitle>
        <CardDescription>
          Connecte-toi et crée ton compte avec un pseudo unique
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col items-center justify-center">
          <Button variant="outline" onClick={handleCreateAccountClick}>
            <img src='../../../../assets/Final-sigle-seul.svg' className="mr-2 w-10 h-10" />
          </Button>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}  
