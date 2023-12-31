import { CreateAccount } from "@/lib/components/auth/CreateAccount";
import { isTokenValid } from "@/lib/components/utils/UtilsFetch";
import { useEffect } from 'react';
//import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await isTokenValid();

      if (isValid) {
        navigate('/');
      }
    };
  
    checkToken();
  }, [navigate]);

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
        <CreateAccount/>
      </div>
    );
  };
  
  export default Login;
