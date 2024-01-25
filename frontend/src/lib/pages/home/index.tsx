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
  const socket = useSocket();

  useEffect(() => {
    // Placeholder for future socket event listeners
    // Example: socket.on('gameEvent', handleGameEvent);

    // Placeholder for future token validation logic
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

    // Clean up function for removing event listeners specific to the Home component
    return () => {
      // Example: socket.off('gameEvent', handleGameEvent);
      // This will remove the 'gameEvent' listener when the Home component unmounts
    };
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
