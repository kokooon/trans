import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/lib/components/ui/button";
import { UserNav } from '@/lib/components/ui/user-nav';
import { isTokenValid, isUserConnected, fetchUserDetails } from '@/lib/components/utils/UtilsFetch';
//import io from 'socket.io-client';
//import { fetchUserDetails } from '../../components/utils/UtilsFetch';
import { useSocket } from '../../components/utils/socketContext'; 

const Home = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();

  useEffect(() => {
    const checkToken = async () => {
      try {
          const isValid = await isTokenValid();
          if (!isValid) {
              navigate('/login');
              return;
          }

          const userData = await fetchUserDetails();

          if (userData[0].is2FAEnabled !== false) {
              const isConnected = await isUserConnected();
              console.log(isConnected);
              if (!isConnected) {
                  navigate('/2fa');
              }
          }
      } catch (error) {
          console.error('Error:', error);
      }
  };
  checkToken();
  if (socket) {
    socket.on('gameInvite', () => {
        console.log('in gameInvit in social');
      navigate('/gameInvit');
  });
        return () => {
            socket.off('gameInvite')
        }
    }
  }, [navigate, socket]);

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
