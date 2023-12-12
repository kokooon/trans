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
            <p>ceci est la page du profile !</p>
        </div>
    )
}

export default Profile