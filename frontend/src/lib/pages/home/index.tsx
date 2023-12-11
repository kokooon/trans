import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [cookies] = useCookies(['userToken']);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.userToken) {
      console.log("le cookie n existe pas")
      navigate('/login');
    }
  }, [cookies.userToken, navigate]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
      <h1> Home !</h1>
      {/* Le reste du contenu de votre page d'accueil */}
    </div>
  );
};

export default Home;
