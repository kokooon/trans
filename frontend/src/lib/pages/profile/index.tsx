import { UserNav } from '@/lib/components/ui/user-nav';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
    

const Profile = () => {
    const [cookies, ,] = useCookies(['userToken']);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!cookies.userToken) {
        navigate('/login');
      }
    }, [cookies.userToken, navigate]);
    return (
        <div>
            <UserNav/>
        </div>
    )
}

export default Profile