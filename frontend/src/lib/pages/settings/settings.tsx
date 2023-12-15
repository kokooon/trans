// import {Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar"
import { UserNav } from "@/lib/components/ui/user-nav";
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { fetchUserDataAndAvatar, isTokenValid } from "@/lib/components/utils/UtilsFetch";
// import { Input } from "@/lib/components/ui/input";

const Settings = () => {
    const [cookies, ,] = useCookies(['userToken', 'userPseudo']);
    const navigate = useNavigate();
    const [, setUser] = useState<User | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [username, setUsername] = useState<string>(''); // Pour le nom de l'utilisateur
    const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            const { userData, avatarData } = await fetchUserDataAndAvatar(cookies.userPseudo || '');
            setUser(userData);
            setAvatar(avatarData);
        };

        fetchData();
    }, [cookies.userPseudo]);

    useEffect(() => {
        if (!isTokenValid(cookies.userToken)) {
            navigate('/login');
        }
    }, [cookies.userToken, navigate]);

    const handleProfilePictureClick = () => {
      // Logique pour changer la photo de profil
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
  };

  const handleNameSubmit = () => {
      // Logique pour mettre à jour le nom de l'utilisateur
  };

  const toggle2FA = () => {
      setIs2FAEnabled(!is2FAEnabled);
      // Logique supplémentaire pour gérer le 2FA
  };
  
    return (
        <div>
        <UserNav/>
      <div className="flex flex-col items-center p-4">
      {/* Photo de profil */}
      <div className="mb-4 cursor-pointer profile-pic-container mb-4 cursor-pointer hover:scale-110 transition-transform duration-300" onClick={handleProfilePictureClick}>
          <img src={avatar || 'placeholder_url'} alt="Profile" className="rounded-full w-28 h-28" />
      </div>

      {/* Changement de nom */}
      <div className="mb-4">
          <input 
              type="text" 
              value={username} 
              onChange={handleNameChange} 
              className="border rounded p-2 mr-2"
              placeholder="Username" 
          />
          <button onClick={handleNameSubmit} className="bg-blue-500 text-white rounded p-2">
              Update
          </button>
      </div>

      {/* Switch pour 2FA */}
      <div className="flex items-center">
          <label className="switch">
              <input 
                  type="checkbox" 
                  checked={is2FAEnabled} 
                  onChange={toggle2FA} 
              />
              <span className="slider round"></span>
          </label>
          <span className="ml-2">{is2FAEnabled ? '2FA Enabled' : '2FA Disabled'}</span>
      </div>
  </div>
  </div>
);
}

export default Settings;