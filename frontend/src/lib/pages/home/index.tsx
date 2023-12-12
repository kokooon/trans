import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/lib/components/ui/button";
import { UserNav } from '@/lib/components/ui/user-nav';

const Home = () => {
  const [cookies, ,] = useCookies(['userToken']);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.userToken) {
      navigate('/login');
    }
  }, [cookies.userToken, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-start justify-between p-4">
        <div className="ml-auto">
          <UserNav />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <Button variant="outline" className="osef" onClick={() => navigate('/game')}>
          <p>Play !</p>
        </Button>
        {/* Le reste du contenu de votre page d'accueil */}
      </div>
    </div>
  );
};

export default Home;
