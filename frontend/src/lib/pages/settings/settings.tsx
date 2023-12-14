import {Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar"
import { UserNav } from "@/lib/components/ui/user-nav";
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
      <div>
        <UserNav/>
      </div>
        <div>
            <Avatar className="h-50 w-50">
              <AvatarImage src="https://cdn.pixabay.com/photo/2015/05/13/13/53/skull-765477_640.jpg" alt="@shadcn"/>
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
        </div>
        </div>
    )
}

export default Settings;