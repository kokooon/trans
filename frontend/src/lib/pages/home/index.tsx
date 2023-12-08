import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/lib/components/ui/button";

const Home = () => {
  const [cookies, , removeCookie] = useCookies(['userToken']); // Destructure and skip the setCookie variable
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.userToken) {
      navigate('/login');
    }
  }, [cookies.userToken, navigate]);

  const handleLogout = () => {
    // Supprime le cookie 'userToken'
    removeCookie('userToken');
    // Redirige vers la page de connexion
    navigate('/login');
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className="flex items-center mx-auto">
          <Button variant="outline" className="osef" onClick={() => navigate('/profile')}>
            <p>Profile </p>
          </Button>
        </div>
        <div className="ml-auto">
          <Button variant="outline" className="" onClick={handleLogout}>
            <p>Logout</p>
          </Button>
        </div>
      </div>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
        <Button variant="outline" className="osef" onClick={() => navigate('/game')}>
          <p> Play !</p>
        </Button>
        {/* Le reste du contenu de votre page d'accueil */}
      </div>
    </div>
  );
};

export default Home;
