import { UserNav } from "@/lib/components/ui/user-nav";
import { useEffect, useState } from 'react';
//import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails, isTokenValid } from "@/lib/components/utils/UtilsFetch";
//import { User } from "./user.model";
// import speakeasy from 'speakeasy'; 
import { toggle2FA } from "@/lib/components/auth/2fa/2fa";

const Settings = () => {
    //const [cookies, ,] = useCookies(['userToken', 'userPseudo']);
    const navigate = useNavigate();
    const [user, setUser] = useState<any | null>(null);
   //const [avatar, setAvatar] = useState<string | null>(null);
    const [username, ] = useState<string>(''); 
    const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [sizeNotification, setSizeNotification] = useState<boolean>(false);

    useEffect(() => {
        const checkToken = async () => {
          const isValid = await isTokenValid();
    
          if (isValid === false) {
            navigate('/login');
          }
        };
      
        checkToken();
      }, [navigate]);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const result = await fetchUserDetails();
            if (result && result.length > 0)
            {            
                const userData = result[0];
                setUser(userData);
            }
          } catch (error) {
            console.error('Error fetching user details:', error);
            //setError('Failed to fetch user details');
          }
        };
      
        fetchData();
      }, []);
      
      const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log("avatar = ", file);
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setSizeNotification(true);
                setTimeout(() => setSizeNotification(false), 3000);
                return;
            }
    
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'ft_trans');
    
            try {
                // Upload image to Cloudinary
                const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/dqyyh88tq/image/upload`, {
                    method: 'POST',
                    body: formData
                });
    
                const data = await uploadResponse.json();
                console.log("data = ", data.secure_url);
    
                // Post the secure URL to your backend
                const backendResponse = await fetch('http://127.0.0.1:3001/users/changeAvatar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ avatarUrl: data.secure_url }),
                });
    
                if (!backendResponse.ok) {
                    throw new Error('Network response was not ok');
                }
    
                // Handle successful upload and backend response here
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            } catch (error) {
                console.error('Error:', error);
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            }
        }
    };
    
    

    const handleProfilePictureClick = () => {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChangePseudo(event);
    };
    
    const handleChangePseudo = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            console.log(username)
            // Envoyer le nouveau pseudo au backend
            const response = await fetch('http://127.0.0.1:3001/users/changePseudo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Inclure des en-têtes supplémentaires si nécessaire, comme pour l'authentification
                },
                credentials: 'include', // Inclure les cookies avec la requête
                body: JSON.stringify({ newPseudo: event.target.value }),
            });
    
            if (!response.ok) {
                throw new Error('La réponse du réseau n’était pas correcte');
            }
    
            // Gérer ici la mise à jour réussie du pseudo
            // Vous pourriez vouloir afficher une notification ou mettre à jour l'interface utilisateur
        } catch (error) {
            console.error('Erreur lors de la mise à jour du pseudo :', error);
            // Gérer l'erreur ici, comme afficher une notification à l'utilisateur
        }
    };

    const handleNameSubmit = () => {
        // Logique pour mettre à jour le nom de l'utilisateur
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const toggle2FAHandler = () => {
        toggle2FA(is2FAEnabled, setIs2FAEnabled);
      };

    return (
        <div>
            <UserNav/>
            <div className="flex flex-col items-center p-4">
                {/* Photo de profil */}
                <div className="w-full flex justify-center">
                    <div className="mb-4 cursor-pointer profile-pic-container hover:scale-110 transition-transform duration-300" onClick={handleProfilePictureClick}>
                    <img src={user && user.avatar ? user.avatar || 'placeholder_url' : 'placeholder_url'} alt="Profile" className="rounded-full w-28 h-28" />
                        <input 
                            type="file" 
                            id="fileInput" 
                            style={{ display: 'none' }} 
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className={`fixed bottom-5 left-5 bg-red-500 text-white py-2 px-4 rounded opacity-75 flex items-start justify-between ${sizeNotification ? 'block' : 'hidden'}`}>
                            <span>Error with the file upload</span>
                            <div className="w-full bg-gray-400 absolute top-0 left-0 h-1">
                                <div className="bg-gray-800 h-1 w-0 progress-bar"> </div>
                            </div>
                        </div>
                </div>

                {/* Changement de nom */}
                <div className="flex flex-col items-center gap-4">
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
                        <div className={`fixed bottom-5 left-5 bg-green-500 text-white py-2 px-4 rounded opacity-75 flex items-start justify-between ${showNotification ? 'block' : 'hidden'}`}>
                            <span>updated successfully!</span>
                            <div className="w-full bg-gray-400 absolute top-0 left-0 h-1">
                                <div className="bg-gray-800 h-1 w-0 progress-bar"> </div>
                            </div>
                        </div>
                    </div>

                    {/* Switch pour 2FA */}
                    <div className="flex items-center">
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={is2FAEnabled} 
                                onChange={toggle2FAHandler} 
                            />
                            <span className="slider round"></span>
                        </label>
                        <span className="ml-2">{is2FAEnabled ? '2FA Enabled' : '2FA Disabled'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
