import { UserNav } from "@/lib/components/ui/user-nav";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails, isTokenValid } from "@/lib/components/utils/UtilsFetch";
import { toggle2FA } from "@/lib/components/auth/2fa/2fa";
//import { Button } from "@/lib/components/ui/button";


const Settings = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any | null>(null);
    const [username, ] = useState<string>(''); 
    const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [sizeNotification, setSizeNotification] = useState<boolean>(false);
    const [codeInput, setcodeInput] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [validCode, setValidCode] = useState<boolean>(false);
    validCode;
    useEffect(() => {
        const checkToken = async () => {
            const isValid = await isTokenValid();
            if (!isValid) {
              navigate('/login');
              return;
            }
          const userData = await fetchUserDetails();        
            setUser(userData);
                if (userData[0].is2FAEnabled !== undefined) {
                    setIs2FAEnabled(userData[0].is2FAEnabled);
                  } 
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
                    body: JSON.stringify({ avatarUrl: data.secure_url, userId: user.id }),
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
                body: JSON.stringify({ newPseudo: event.target.value, userId: user.id }),
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
        handleQrCode();
      };

      const handleValidationClick = async () => {
        //GET secret with user id (in user[0].id)
        console.log("code input = ", codeInput);
        try {
          const response = await fetch('http://127.0.0.1:3001/auth/verify-2fa', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ userId: user[0].id, codeinput: codeInput }),
          });
          if (response.ok) {
            console.log("valid code");
            setValidCode(true);
            navigate('/');
          }
          else {
            setValidCode(false);
            console.log("code not valid");
          }
        } catch (error) {
          console.log("error");
        }
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
                    {qrCodeUrl && (
            <div className="qr-code-container">
              <img src={qrCodeUrl} alt="QR Code" className="my-4 w-30 h-30" />
              <div className="input-container my-4">
                <input 
                  type="text"
                  value={codeInput}
                  onChange={(e) => setcodeInput(e.target.value)}
                  placeholder="code"
                  className="input-small" 
                  style={{ color: 'red' }} // Ajoutez cette ligne pour le texte en rouge
                />
                <button onClick={handleValidationClick} className="validate-button">
                  Valider
                </button>
              </div>
            </div>
          )}
                </div>
            </div>
        </div>
    );
}

export default Settings;
