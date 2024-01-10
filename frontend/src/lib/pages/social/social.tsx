import { useEffect, useState } from 'react';
import { fetchUserDetails } from '../../components/utils/UtilsFetch';
//import { fetchAvatarByPseudo } from '../utils/UtilsFetch';
//import { User } from '../settings/user.model.tsx';
import { Button } from "@/lib/components/ui/button";
//import { AddFriends } from '@/lib/components/ui/AddFriends'
//import { UserNav } from '@/lib/components/ui/user-nav';
//import { useCookies } from 'react-cookie';
//import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import "../../styles/social.css"

const social = () => {
    const [currentView, setCurrentView] = useState('Notifications');
    const [Lists, setLists] = useState<string[]>([]);
    const [user, setUser] = useState<any | null>(null);
    const [blockInput, setBlockInput] = useState(''); // Valeur de l'entrée de texte pour bloquer
    const [addInput, setaddInput] = useState(''); // Valeur de l'entrée de texte pour add
    const [ChannelName, setChannelName] = useState(''); // Valeur de l'entrée de texte pour cree channel
    const [passwordInput, setPasswordInput] = useState('');
    const [channelVisibility, setChannelVisibility] = useState('public');
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column', // Utilisez 'row' pour un alignement horizontal
        alignItems: 'center',    // Centre horizontalement dans un conteneur 'flex'
        justifyContent: 'center'
      };

    currentView;
    Lists;
    useEffect(() => {
        const fetchData = async () => {
          const userData = await fetchUserDetails();
          setUser(userData); 
        };
        fetchData();
    }, []);

   const handleadd = async () => {
        try {
          // Envoyer le nouveau pseudo au backend
          const response = await fetch('http://127.0.0.1:3001/users/FriendRequest', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ addFriend: addInput }),
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
        setaddInput('');
      };

    const handleBlock  = async () => {
        // Logique de blocage ici
        try {
            // Envoyer le nouveau pseudo au backend
            const response = await fetch('http://127.0.0.1:3001/users/Block', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Inclure des en-têtes supplémentaires si nécessaire, comme pour l'authentification
                },
                credentials: 'include', // Inclure les cookies avec la requête
                body: JSON.stringify({ blockpseudo: blockInput }),
            });
            if (!response.ok) {
                throw new Error('La réponse du réseau n’était pas correcte');
            }
            // Gérer ici la mise à jour réussie du friend
        } catch (error) {
            console.error('Erreur lors du blockage :', error);
        }
        // Réinitialiser l'entrée de texte
        setBlockInput('');
    };

     const handleAccept = async (friend: string) => {
         console.log("Accepted friend:", friend);
         //POST ajouter l'id dans la colonne friends
         //retirer l'id des notifs
         try {
             // Envoyer le nouveau pseudo au backend
             const response = await fetch('http://127.0.0.1:3001/users/AcceptFriend', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                     // Inclure des en-têtes supplémentaires si nécessaire, comme pour l'authentification
                 },
                 credentials: 'include', // Inclure les cookies avec la requête
                 body: JSON.stringify({ friendPseudo: friend }),
             });
             if (!response.ok) {
                 throw new Error('La réponse du réseau n’était pas correcte');
             }
             // Gérer ici la mise à jour réussie du friend
         } catch (error) {
             console.error('Erreur lors de l\'ajout du friend :', error);
        }
    }
    
     const handleDecline = async (friend: string) => {
         console.log("Declined friend:", friend);
         //POST retirer l'id des notifs et request
         try {
             // Envoyer le nouveau pseudo au backend
             const response = await fetch('http://127.0.0.1:3001/users/RefuseFriend', {
                 method: 'POST',
                 headers: {
                    'Content-Type': 'application/json',
                     // Inclure des en-têtes supplémentaires si nécessaire, comme pour l'authentification
                 },
                 credentials: 'include', // Inclure les cookies avec la requête
                body: JSON.stringify({ friendPseudo: friend }),
             });
             if (!response.ok) {
                 throw new Error('La réponse du réseau n’était pas correcte');
             }
             // Gérer ici la mise à jour réussie du friend
         } catch (error) {
             console.error('Erreur lors de l\'ajout du friend :', error);
         }
    }

    const getFriends  = async () => {
        setCurrentView('Friends');
        try {
            const List = []; // Créez une nouvelle liste pour les amis
    
            for (let i = 0; i < user[0].friends.length; i++) {
                const friendId = user[0].friends[i];
                const response = await fetch(`http://127.0.0.1:3001/users/friends/${friendId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
    
                if (response.ok) {
                    const responseData = await response.text();
                    List.push(responseData);
                } else {
                    console.error('Get friends failed for friendId:', friendId);
                }
            }
    
            // Mettez à jour FriendsLists avec la liste complète des amis
            setLists([...List]);
        } catch (error) {
            console.error('Error during get friends:', error);
        }
    };

    const getChannel = async () => {
        setCurrentView('Channel');
        const List = []; // Créez une nouvelle liste pour les amis
        for (let i = 0; i < user[0].channels.length; i++) {
            const channelId = user[0].channels[i];
            const response = await fetch(`http://127.0.0.1:3001/channels/channelNameById/${channelId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const responseData = await response.text();
                    List.push(responseData);
                }
            // Mettez à jour FriendsLists avec la liste complète des amis
            setLists([...List]);
        }
    }

    const getBlock  = async () => {
        setCurrentView('Blocked');
        try {
            const List = []; // Créez une nouvelle liste pour les amis
    
            for (let i = 0; i < user[0].banlist.length; i++) {
                const friendId = user[0].banlist[i];
                const response = await fetch(`http://127.0.0.1:3001/users/friends/${friendId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
    
                if (response.ok) {
                    const responseData = await response.text();
                    List.push(responseData);
                } else {
                    console.error('Get friends failed for friendId:', friendId);
                }
            }
            // Mettez à jour FriendsLists avec la liste complète des amis
            setLists([...List]);
        } catch (error) {
            console.error('Error during get friends:', error);
        }
    };

    const getNotifications = async () => {
        setCurrentView('Notifications');
        try {
            const friendsList = []; // Créez une nouvelle liste pour les amis
    
            for (let i = 0; i < user[0].friendNotif.length; i++) {
                const friendId = user[0].friendNotif[i];
                const response = await fetch(`http://127.0.0.1:3001/users/friends/${friendId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const responseData = await response.text();
                    friendsList.push(responseData);
                } else {
                    console.error('Get friends failed for friendId:', friendId);
                }
            }
    
            // Mettez à jour FriendsLists avec la liste complète des amis
            setLists([...friendsList]);
        } catch (error) {
            console.error('Error during get notifs:', error);
        }
    };

    const handleUnblock  = async (unblockPseudo: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:3001/users/social/unblock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Inclure des en-têtes supplémentaires si nécessaire, comme pour l'authentification
                },
                credentials: 'include', // Inclure les cookies avec la requête
                body: JSON.stringify({ unblockpseudo: unblockPseudo }),
            });
            if (!response.ok) {
                throw new Error('La réponse du réseau n’était pas correcte');
            }
            // Gérer ici la mise à jour réussie du friend
        } catch (error) {
            console.error('Erreur lors du blockage :', error);
        }
    };

    const handleCreateChannel = async () => {
        try {
          const channelData = {
            name: ChannelName, // From your state
            password: passwordInput, // From your state, could be empty if not private
            visibility: channelVisibility, // From your state
            admin: user[0].id,
            memberIds: user[0].id // The current user's ID
          };
          if (!ChannelName){
            console.log("need a name for the channel");
            return ;
          }
          const response = await fetch('http://127.0.0.1:3001/channels/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // if you're including credentials like cookies
            body: JSON.stringify(channelData),
          });
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error while creating channel:', errorData.error);
            if (response.status === 409) {
                console.log("channel name already taken");
                return;
              }
          }
          const newChannel = await response.json();
          const responsetwo = await fetch('http://127.0.0.1:3001/users/channel/AddInUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // if you're including credentials like cookies
            body: JSON.stringify({ channelId: newChannel.id }),
          });
          if (!responsetwo.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
        } catch (error) {
          console.error('Error during channel creation:', error);
        }
        setChannelName('');
        setPasswordInput('');
      };

    const handleJoinChannel  = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3001/channels/findChannelByName/${ChannelName}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                      },
                    credentials: 'include',
                });
                if (response.ok){
                    const responseData = await response.json();
                    if (responseData.password) {
                        if (!passwordInput || (passwordInput !== responseData.password)){
                            console.log("wrong password or password missing1")
                            return;
                        }
                        //ad channel id in user
                        const responsetwo = await fetch('http://127.0.0.1:3001/users/channel/AddInUser', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        credentials: 'include', // if you're including credentials like cookies
                        body: JSON.stringify({ channelId: responseData.id }),
                        });
                        if (!responsetwo.ok) {
                            throw new Error(`Network response was not ok: ${response.statusText}`);
                        }
                        //add userId in channel membersId
                        const responsethree = await fetch(`http://127.0.0.1:3001/channels/addUserId/${user[0].id}`, {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        credentials: 'include', // if you're including credentials like cookies
                        body: JSON.stringify({ channelName: responseData.name }),
                        });
                        if (!responsethree.ok) {
                            throw new Error(`Network response was not ok: ${response.statusText}`);
                        }
                    }
                    else {
                        if (passwordInput){
                            console.log("wrong password or password missing");
                            return ;
                        }
                        else {
                            const responsetwo = await fetch('http://127.0.0.1:3001/users/channel/AddInUser', {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            },
                            credentials: 'include', // if you're including credentials like cookies
                            body: JSON.stringify({ channelId: responseData.id }),
                            });
                            if (!responsetwo.ok) {
                                throw new Error(`Network response was not ok: ${response.statusText}`);
                            }
                            const responsethree = await fetch(`http://127.0.0.1:3001/channels/addUserId/${user[0].id}`, {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            },
                            credentials: 'include', // if you're including credentials like cookies
                            body: JSON.stringify({ channelName: responseData.name }),
                            });
                        if (!responsethree.ok) {
                            throw new Error(`Network response was not ok: ${response.statusText}`);
                            }
                        }
                        // responseData = 2 password needed
                    }
                }
                else {
                    console.error('unable to find channel:', ChannelName);
                    return;
                }
            } catch (error) {
                console.error('Error during join channel:', error);
            }
            setPasswordInput('');     
    };

    const handleUnfriend  = async (friendname: string) => {
        try {
            const response = await fetch('http://127.0.0.1:3001/users/Unfriend', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include', // if you're including credentials like cookies
                body: JSON.stringify({ friendName: friendname }),
              });
              if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
        }
        catch (error) {
            console.log("unable to unfriend");
        }
    };
    
    return (
        <div className="main-container"> {/* Cadre principal (orange) */}
            <div className="functionality-container"> {/* Cadre fonctionnalités (rouge) */}
            <div className="button-group"> {/* Conteneur pour les boutons */}
                <Button variant="outline" className="button-small" onClick={getNotifications}>Notifications</Button>
                <Button variant="outline" className="button-small" onClick={getFriends}>Friends</Button>
                <Button variant="outline" className="button-small" onClick={getBlock}>Blocked</Button>
                <Button variant="outline" className="button-small" onClick={getChannel}>Channel</Button>
            </div>
            {currentView === 'Notifications' && (
                <div className="content-display">
                    {Lists.map((notification, index) => (
                        <div key={index} className="notification-item">
                            <span>{notification}</span>
                            <Button variant="outline" className="button-small" onClick={() => handleAccept(notification)}>Accepter</Button>
                            <Button variant="outline" className="button-small" onClick={() => handleDecline(notification)}>Décliner</Button>
                        </div> // Affichage des notifications avec boutons pour accepter ou décliner
                    ))}
                </div>
            )}
            {currentView === 'Friends' && (
                <div className="content-display">
                    {Lists.map((friend, index) => (
                       <div key={index} className="notification-item">
                       <span>{friend}</span>
                       <Button variant="outline" className="button-small" onClick={() => handleUnfriend(friend)}>Unfriend</Button>
                   </div> // Affichage des notifications avec boutons pour accepter ou décliner
                    ))}
                </div>
            )}
            {currentView === 'Blocked' && (
                <div className="content-display">
                    {Lists.map((blockedUser, index) => (
                        <div key={index} className="blocked-item">
                            <span>{blockedUser}</span>
                            <Button variant="outline" className="button-small" onClick={() => handleUnblock(blockedUser)}>Unblock</Button>
                        </div> // Affichage des utilisateurs bloqués avec bouton pour débloquer
                    ))}
                </div>
            )}
            {currentView === 'Channel' && (
                <div className="content-display">
                    {Lists.map((channel, index) => (
                        <div key={index}>{channel}</div> // Affichage des canaux
                    ))}
                </div>
            )}
            <div className="functionality-content">
                {/* Contenu qui change en fonction des boutons cliqués */}
            </div>
            <div className="additional-features">
                <div className="block-user">
                    <input
                        type="text"
                        value={blockInput}
                        onChange={(e) => setBlockInput(e.target.value)}
                        placeholder="Block ID"
                        className="input-small"
                    />
                    <Button variant="outline" className="button-small" onClick={handleBlock}>Block</Button>
                    <input
                        type="text"
                        value={ChannelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        placeholder="Channel Name"
                        className="input-small"
                    />
                    <Button variant="outline" className="button-small" onClick={handleOpen}>Create Channel</Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                     <Box sx={style}>
                        <div>
                     <input
                        type="radio"
                        id="public"
                        name="visibility"
                        value="public"
                        checked={channelVisibility === 'public'}
                        onChange={(e) => setChannelVisibility(e.target.value)}
                    />
                    <label htmlFor="public" className="mr-4">Public</label>
                    <input
                        type="radio"
                        id="private"
                        name="visibility"
                        value="private"
                        checked={channelVisibility === 'private'}
                        onChange={(e) => setChannelVisibility(e.target.value)}
                    />
                    <label htmlFor="private">Private</label>
                    </div>
                    {channelVisibility === 'private' && (
                    <div className="mt-4">
                        <input
                            type="text"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="Channel password"
                            required
                        />
                    </div>
                    )}
                    <Button variant="outline" className="button-small mt-4" onClick={handleCreateChannel}>Create Channel</Button>
                    </Box>
                    </Modal>
                </div>
                <div className="visibility-options">
                 </div>
                <div className="add-user">
                    <input
                        type="text"
                        value={addInput}
                        onChange={(e) => setaddInput(e.target.value)}
                        placeholder="Add User"
                        className="input-small"
                    />
                    <Button variant="outline" className="button-small" onClick={handleadd}>Add</Button>
                    <input
                        type="text"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Channel password"
                        className="input-small"
                    />
                    <Button variant="outline" className="button-small" onClick={handleJoinChannel}>Join Channel</Button>
                </div>
            </div>
        </div>
        <div className="chat-container">
            <div className="message-thread">
                {/* Les messages du chat seront affichés ici */}
            </div>
            <div className="chat-input-container">
                <input type="text" placeholder="Type a message..." className="chat-input" />
                <button className="chat-send-button">Send</button>
            </div>
        </div>
    </div>
    );
}
export default social;