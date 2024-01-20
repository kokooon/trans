import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails, isTokenValid } from "@/lib/components/utils/UtilsFetch";
import {
    Card,
    CardContent,
    // CardDescription,
    CardFooter,
    // CardFooter,
    CardHeader,
    CardTitle,
  } from "@/lib/components/ui/card";

const TwoFa = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState<any | null>(null);
    const [codeInput, setcodeInput] = useState('');
  
    useEffect(() => {
        const checkToken = async () => {
            const isValid = await isTokenValid();
            if (!isValid) {
              navigate('/login');
              return;
            }
          const userData = await fetchUserDetails();        
            setUser(userData);
             if (userData[0].is2FAEnabled === false)
                navigate('/');
        };
      
        checkToken();
      }, [navigate]);


    const handleValidationClick = async () => {
        //GET secret with user id (in user[0].id)
        console.log("code input = ", codeInput);
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
            navigate('/');
          }
          else {
            console.log("code not valid");
          }
        } catch (error) {
          console.log("error");
        }
      };

      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">2FA</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-col items-center justify-center">
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
                
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
        </div>
      );
}

export default TwoFa