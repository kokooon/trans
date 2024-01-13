import React, { useState, useEffect } from 'react';
import { Button } from "@/lib/components/ui/button";
import { useNavigate } from 'react-router-dom'; // if you're using react-router for navigation
import { isTokenValid } from "@/lib/components/utils/UtilsFetch";
//import { useCookies } from 'react-cookie';
import { fetchUserDetails } from '../../components/utils/UtilsFetch';


export function CreateAccount() {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);

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
    console.log("user = ", user[0]);

    if (isValid && !user[0].is2FAEnabled) {
      navigate('/');
    } else if (isValid && user[0].is2FAEnabled) {
      try {
        const response = await fetch('http://127.0.0.1:3001/auth/enable-2fa', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const responseData = await response.json();
          setQrCodeUrl(responseData[0].qrcode);
          console.log(responseData[0].qrcode);
        }
      } catch (error) {
        console.log("error");
      }
    }
    else if (!isValid){
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
        <img src="../../assets/final-sigle-seul.svg" alt="Create Account" className="mr-2 w-10 h-10" />
        {/* Render QR code if URL is set */}
        {qrCodeUrl && <img src={qrCodeUrl} alt="2FA QR Code" />}
      </Button>
    </div>
  );
}
