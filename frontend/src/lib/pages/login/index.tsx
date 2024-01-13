import { CreateAccount } from "@/lib/components/auth/CreateAccount";
import { isTokenValid } from "@/lib/components/utils/UtilsFetch";
import { useEffect } from 'react';
//import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useState} from 'react';
import { fetchUserDetails } from '../../components/utils/UtilsFetch';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserDetails();
      setUser(userData); 
    };
    fetchData();
}, []);

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await isTokenValid();
      console.log("user = ", user[0]);
      if (isValid && !user[0].is2FAEnabled) {
        navigate('/');
      }
      else if (isValid && user[0].is2FAEnabled){
        try {
          const response = await fetch(`http://127.0.0.1:3001/auth/enable-2fa`, {
            method: 'GET',
            credentials: 'include',
            });
            if (response.ok) {
              const responseData = await response.json();
              setQrCodeUrl(responseData[0].qrcode);
              qrCodeUrl;
              console.log(responseData[0].qrcode);
            }
        } catch(error){
          console.log("error");
        }
        //afficher qrcode
        //get qrCodeUrl
        //res.render('enable-2fa', { qrCodeUrl, otpSecret: secret.otpSecret });
      }
    };
  
    checkToken();
  }, [navigate]);

    return ( //afficher qrcode etc if isValid && user[0].is2FAEnabled
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
        <CreateAccount/>
      </div>
    );
  };
  
  export default Login;
