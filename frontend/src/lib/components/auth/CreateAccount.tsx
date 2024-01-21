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
  const [user, setUser] = useState<any | null>(null);
  const [codeInput, setcodeInput] = useState('');
  const [validCode, setValidCode] = useState('');

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
      window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-583457b7e26f8aded8eb59025a81e8399ae8f76265cc6e3b0ba7cc99fe3560cc&redirect_uri=http%3A%2F%2F127.0.0.1%3A3001%2Fauth%2F42%2Fcallback&response_type=code';
  
    // Further actions or rendering based on QR code URL can be handled here.
  };

  // Handler function for the onClick event
  const handleCreateAccountClick = () => {
    checkToken(); // This will check the token and handle QR code generation.
  };

  const handleValidationClick = async () => {
    //GET secret with user id (in user[0].id)
    try {
      const response = await fetch('http://127.0.0.1:3001/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId: user[0].id, codeinput: codeInput }),
      });
      if (response.ok) {
        console.log("valid code");
        setValidCode('valid');
        navigate('/');
      }
      else {
        setValidCode('invalid');
        console.log("code not valid");
      }
    } catch (error) {
      console.log("error");
    }
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
            <div className="qr-code-container">
              <div className="input-container my-4">
                <input 
                  type="text"
                  value={codeInput}
                  onChange={(e) => setcodeInput(e.target.value)}
                  placeholder="code"
                  className="input-small" 
                  style={{ color: 'red' }} // Ajoutez cette ligne pour le texte en rouge
                />
                <button onClick={handleValidationClick} className="validate-button">
                  Valider
                </button>
              </div>
            </div>
          {validCode === 'invalid' && (
            <div className="error-message">
              Code not valid, retry
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}  
