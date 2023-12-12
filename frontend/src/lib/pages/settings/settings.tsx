import {Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar"
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';


const Settings = () => {
    const [cookies, ,] = useCookies(['userToken']);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!cookies.userToken) {
        navigate('/login');
      }
    }, [cookies.userToken, navigate]);
    return (
        <div>
            <Avatar className="h-50 w-50">
              <AvatarImage src="https://cdn.intra.42.fr/users/92731bef5d53f8af1ed11fd026274345/gmarzull.jpg" alt="@shadcn"/>
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
        </div>
    )
}

export default Settings;