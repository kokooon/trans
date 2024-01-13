import { useEffect, useState} from 'react';
import { Button } from "@/lib/components/ui/button";
import { useNavigate } from 'react-router-dom'; // if you're using react-router for navigation
import { isTokenValid } from "@/lib/components/utils/UtilsFetch";
//import { useCookies } from 'react-cookie';
import { fetchUserDetails } from '../../components/utils/UtilsFetch';


export function CreateAccount() {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);
  qrCodeUrl;
  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserDetails();
      setUser(userData); 
    };
    fetchData();
  }, []);

  const checkToken = async () => {
    // This isTokenValid function needs to be defined or imported from your auth utilities
    const isValid = await isTokenValid(); // Replace with actual token validation call
    // The user array needs to be obtained from your auth state or context
    //console.log("user = ", user[0]);

    if (isValid && !user[0].is2FAEnabled) { //si cookie valide et pas 2fa rediriger /home
      console.log("already login and no 2fa");
      navigate('/');
    } else if (isValid && user[0].is2FAEnabled) { //si cookie valid et 2fa activer afficher qrcode //marche pas a fix
      console.log("already login and 2fa enabled");
      try {
        const response = await fetch('http://127.0.0.1:3001/auth/enable-2fa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ userId: user[0].id }),
        });
        if (response.ok) {
          const responseData = await response.json();
          setQrCodeUrl(responseData.qrcodeUrl);
          console.log("qrcode url = ", qrCodeUrl);
        }
      } catch (error) {
        console.log("error");
      }
    }
    else if (!isValid){
      console.log("never login and no 2fa"); //si pas cookie/pas valide // 42 api // cree compte + donner cookie
      window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-583457b7e26f8aded8eb59025a81e8399ae8f76265cc6e3b0ba7cc99fe3560cc&redirect_uri=http%3A%2F%2F127.0.0.1%3A3001%2Fauth%2F42%2Fcallback&response_type=code';
    }
    // Further actions or rendering based on QR code URL can be handled here.
  };

  // Handler function for the onClick event
  const handleCreateAccountClick = () => {
    checkToken(); // This will check the token and handle QR code generation.
  };

  useEffect(() => {
    // This useEffect could be used for initial token check on component mount, if needed
  }, [navigate]);

  return (
    <div className="flex justify-center">
      <Button variant="outline" onClick={handleCreateAccountClick}>
            <img src='../../../../assets/Final-sigle-seul.svg' className="mr-2 w-10 h-10" />
      </Button>
      {qrCodeUrl && (
        <div className="qr-code-container">
          <img src={qrCodeUrl} alt="QR Code" className="mr-2 w-10 h-10" />
        </div>
      )}
    </div>
  );
}
