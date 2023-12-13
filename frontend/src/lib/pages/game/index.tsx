import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { UserNav } from '@/lib/components/ui/user-nav';
    
const Game = () => {
    const [cookies, ,] = useCookies(['userToken']);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!cookies.userToken) {
        navigate('/login');
      }
    }, [cookies.userToken, navigate]);

    return (
      <div>
          <UserNav />
      </div>
    )
}

export default Game