import { useEffect } from 'react';
//import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/lib/components/ui/button";
import { UserNav } from '@/lib/components/ui/user-nav';
import { isTokenValid } from '@/lib/components/utils/UtilsFetch';
//import { AddFriends } from '@/lib/components/ui/AddFriends';
//import { Chat } from '@/lib/components/Chat/chat';
//import { Chat2 } from '@/lib/components/Chat/chat2';


const Home = () => {
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
