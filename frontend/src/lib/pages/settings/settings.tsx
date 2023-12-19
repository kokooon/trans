import {Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar"
import { UserNav } from "@/lib/components/ui/user-nav";
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { fetchUserDataAndAvatar, isTokenValid } from "@/lib/components/utils/UtilsFetch";
//import { User } from './user.model.tsx';

const Settings = () => {
    const [cookies, ,] = useCookies(['userToken', 'userPseudo']);
    const navigate = useNavigate();
    const [, setUser] = useState<any | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { userData, avatarData } = await fetchUserDataAndAvatar(cookies.userPseudo || '');
            setUser(userData);
            setAvatar(avatarData);
        };

        fetchData();
    }, [cookies.userPseudo]);

    useEffect(() => {
        if (!isTokenValid(cookies.userToken)) {
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
              <AvatarImage src={avatar || 'placeholder_url'} alt="@shadcn"/>
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
        </div>
        </div>
    )
}

export default Settings;