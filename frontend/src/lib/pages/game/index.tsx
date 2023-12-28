import { useEffect } from 'react';
//import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { UserNav } from '@/lib/components/ui/user-nav';
import { isTokenValid } from '@/lib/components/utils/UtilsFetch';
    
const Game = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkToken = async () => {
        const isValid = await isTokenValid();
  
        if (isValid === false) {
          navigate('/login');
        }
      };
    
      checkToken();
    }, [navigate]);

    return (
      <div>
          <UserNav />
      </div>
    )
}

export default Game