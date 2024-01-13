import { CreateAccount } from "@/lib/components/auth/CreateAccount";
//import { useCookies } from 'react-cookie';

const Login = () => {
    return ( //afficher qrcode etc if isValid && user[0].is2FAEnabled
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
        <CreateAccount/>
      </div>
    );
  };
  
  export default Login;
