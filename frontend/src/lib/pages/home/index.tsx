import { useEffect } from 'react';
//import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/lib/components/ui/button";
import { UserNav } from '@/lib/components/ui/user-nav';
import { isTokenValid } from '@/lib/components/utils/UtilsFetch';
import { fetchUserDetails } from '../../components/utils/UtilsFetch';
import io from 'socket.io-client';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const checkTokenAndEstablishConnection = async () => {
      const isValid = await isTokenValid();

      if (!isValid) {
        navigate('/login');
        return;
      }
      const userData = await fetchUserDetails();
      setUser(userData);
      const socket = io('http://127.0.0.1:3001', { withCredentials: true });

      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        // Handle any actions upon successful connection
      });
      return () => {
        socket.disconnect();
        console.log('Disconnected from WebSocket server');
      };
    };
  
    checkTokenAndEstablishConnection();
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <div>
          <UserNav />
          {/*<AddFriends />*/}
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <Button variant="outline" className="osef" onClick={() => navigate('/game')}>
          <p>Play !</p>
        </Button>
        </div>
        {/*<div >
        <Chat />
        </div>*/}
        {/* Le reste du contenu de votre page d'accueil */}
    </div>
  );
};

export default Home;
