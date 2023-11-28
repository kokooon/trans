import { CreateAccount } from "@/lib/components/auth/CreateAccount";

const Login = () => {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
        <CreateAccount/>
      </div>
    );
  };
  
  export default Login;
