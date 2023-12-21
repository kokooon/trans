import { UserNav } from "@/lib/components/ui/user-nav";
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { fetchUserDataAndAvatar, isTokenValid } from "@/lib/components/utils/UtilsFetch";
import { User } from "./user.model";

const Settings = () => {
    const [cookies, ,] = useCookies(['userToken', 'userPseudo']);
    const navigate = useNavigate();
    const [, setUser] = useState<User | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [username, setUsername] = useState<string>(''); 
    const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [sizeNotification, setSizeNotification] = useState<boolean>(false);

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

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
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
                const response = await fetch(`https://api.cloudinary.com/v1_1/dqyyh88tq/image/upload`, {
                    method: 'POST',
                    body: formData
                });
    
                const data = await response.json();
                console.log(data.secure_url);
                setAvatar(data.secure_url);
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            } catch (error) {
                console.error('Error uploading image:', error);
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
        setUsername(event.target.value);
    };

    const handleNameSubmit = () => {
        // Logique pour mettre à jour le nom de l'utilisateur
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
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
                <div className="w-full flex justify-center">
                    <div className="mb-4 cursor-pointer profile-pic-container hover:scale-110 transition-transform duration-300" onClick={handleProfilePictureClick}>
                        <img src={avatar || 'placeholder_url'} alt="Profile" className="rounded-full w-28 h-28" />
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
                                onChange={toggle2FA} 
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
