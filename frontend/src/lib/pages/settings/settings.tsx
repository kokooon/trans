import { UserNav } from "@/lib/components/ui/user-nav";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails, isTokenValid, isUserConnected } from "@/lib/components/utils/UtilsFetch";
import { toggle2FA } from "@/lib/components/auth/2fa/2fa";
//import { Button } from "@/lib/components/ui/button";
import { useUser } from "@/lib/components/utils/UserContext";

const Settings = () => {
    const { setPseudo } = useUser();
    const [localPseudo, setLocalPseudo] = useState("");
    const [showNotification, setShowNotification] = useState<boolean>(false);    
    const navigate = useNavigate();
    const [user, setUser] = useState<any | null>(null);
    const [username, ] = useState<string>(''); 
    const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);
    const [sizeNotification, setSizeNotification] = useState<boolean>(false);
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [validCode,] = useState<boolean>(false);
    validCode;

    useEffect(() => {
      const checkToken = async () => {
        const isValid = await isTokenValid();
        if (!isValid) {
          navigate('/login');
          return;
        }
    
        const checkConnected = async () => {
          const userData = await fetchUserDetails();
          setUser(userData);
    
          if (userData[0].is2FAEnabled !== false) {
            setIs2FAEnabled(userData[0].is2FAEnabled);
            const isConnected = await isUserConnected();
            console.log(isConnected);
            if (!isConnected) {
              navigate('/2fa');
            }
          }
        };
        checkConnected();
      };
      checkToken();
    }, [navigate]);

      const handleQrCode = async () => {
        const userData = await fetchUserDetails();
        if (!(!is2FAEnabled)) { //si cookie valide et pas 2fa rediriger /home
          console.log("no 2fa");
        } else if (!is2FAEnabled) { //si cookie valid et 2fa activer afficher qrcode //marche pas a fix
          console.log("2fa enabled");
          try {
            const response = await fetch('http://127.0.0.1:3001/auth/enable-2fa', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({ userId: userData[0].id }),
            });
            if (response.ok) {
              const responseData = await response.json();
              setQrCodeUrl(responseData.qrcodeUrl);
              qrCodeUrl;
            }
          } catch (error) {
            console.log("error");
          }
        }
      };

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
                // Upload image to Cloudinary
                const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/dqyyh88tq/image/upload`, {
                    method: 'POST',
                    body: formData
                });
                const data = await uploadResponse.json();
                // Post the secure URL to your backend
                const backendResponse = await fetch('http://127.0.0.1:3001/users/changeAvatar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ avatarUrl: data.secure_url, userId: user[0].id }),
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
        setLocalPseudo(event.target.value);
    };

    const handleNameSubmit = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3001/users/changePseudo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ newPseudo: localPseudo }),
            });

            if (response.ok) {
                // Update the global pseudo in the context after successful backend update
                setPseudo(localPseudo);
                // Optionally, show a success notification
            } else {
                // Handle response error (e.g., show an error notification)
                throw new Error('Failed to update pseudo');
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error (e.g., show an error notification)
        }
    };


    const toggle2FAHandler = () => {
        toggle2FA(is2FAEnabled, setIs2FAEnabled);
        handleQrCode();
      };

    return (
        <div>
            <UserNav/>
            <div className="flex flex-col items-center p-4">
                {/* Photo de profil */}
                <div className="w-full flex justify-center">
                    <div className="mb-4 cursor-pointer profile-pic-container hover:scale-110 transition-transform duration-300" onClick={handleProfilePictureClick}>
                    <img src={user && user[0].avatar ? user[0].avatar || 'placeholder_url' : 'placeholder_url'} alt="Profile" className="rounded-full w-28 h-28" />
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
                    {qrCodeUrl && (
            <div className="qr-code-container">
              <img src={qrCodeUrl} alt="QR Code" className="my-4 w-30 h-30" />
            </div>
          )}
                </div>
            </div>
        </div>
    );
}

export default Settings;
