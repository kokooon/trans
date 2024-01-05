import { useEffect, useState } from 'react';
import { fetchUserDetails } from '../../components/utils/UtilsFetch';
//import { fetchAvatarByPseudo } from '../utils/UtilsFetch';
//import { User } from '../settings/user.model.tsx';
import { Button } from "@/lib/components/ui/button";
//import { AddFriends } from '@/lib/components/ui/AddFriends'
//import { UserNav } from '@/lib/components/ui/user-nav';
//import { useCookies } from 'react-cookie';
//import { useNavigate } from 'react-router-dom';
import "../../styles/social.css"

const social = () => {
    const [currentView, setCurrentView] = useState('Notifications');
    const [Lists, setLists] = useState<string[]>([]);
    const [user, setUser] = useState<any | null>(null);
    const [blockInput, setBlockInput] = useState(''); // Valeur de l'entrée de texte pour bloquer
    const [addInput, setaddInput] = useState(''); // Valeur de l'entrée de texte pour add
    const [addChannel, setaddChannel] = useState(''); // Valeur de l'entrée de texte pour add
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
      };

    const handleBlock  = async () => {
        // Logique de blocage ici
        console.log("Blocage de:", blockInput);
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

    // const handleAccept = async (friend: string) => {
    //     console.log("Accepted friend:", friend);
    //     //POST ajouter l'id dans la colonne friends
    //     //retirer l'id des notifs
    //     try {
    //         // Envoyer le nouveau pseudo au backend
    //         const response = await fetch('http://127.0.0.1:3001/users/AcceptFriend', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 // Inclure des en-têtes supplémentaires si nécessaire, comme pour l'authentification
    //             },
    //             credentials: 'include', // Inclure les cookies avec la requête
    //             body: JSON.stringify({ friendPseudo: friend }),
    //         });
    //         if (!response.ok) {
    //             throw new Error('La réponse du réseau n’était pas correcte');
    //         }
    //         // Gérer ici la mise à jour réussie du friend
    //     } catch (error) {
    //         console.error('Erreur lors de l\'ajout du friend :', error);
    //     }
    // }
    
    // const handleDecline = async (friend: string) => {
    //     console.log("Declined friend:", friend);
    //     //POST retirer l'id des notifs et request
    //     try {
    //         // Envoyer le nouveau pseudo au backend
    //         const response = await fetch('http://127.0.0.1:3001/users/RefuseFriend', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 // Inclure des en-têtes supplémentaires si nécessaire, comme pour l'authentification
    //             },
    //             credentials: 'include', // Inclure les cookies avec la requête
    //             body: JSON.stringify({ friendPseudo: friend }),
    //         });
    //         if (!response.ok) {
    //             throw new Error('La réponse du réseau n’était pas correcte');
    //         }
    //         // Gérer ici la mise à jour réussie du friend
    //     } catch (error) {
    //         console.error('Erreur lors de l\'ajout du friend :', error);
    //     }
    // }

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
        for (let i = 0; i < user[0].channels; i++) {
            const channel = user[0].channels[i];
            List.push(channel);
            }
            // Mettez à jour FriendsLists avec la liste complète des amis
            setLists([...List]);
        }

    const getBlock  = async () => {
        setCurrentView('Blocked');
        try {
            const List = []; // Créez une nouvelle liste pour les amis
    
            for (let i = 0; i < user[0].banlist; i++) {
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
    
            for (let i = 0; i < user[0].friendNotifications.length; i++) {
                const friendId = user[0].friendNotifications[i];
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
            console.error('Error during get friends:', error);
        }
    };

    const handleCreateChannel = async () => {
        ;
    }

    const handleJoinChannel  = async () => {
        ;
    }

    return (
        <div className="main-container"> {/* Cadre principal (orange) */}
            <div className="functionality-container"> {/* Cadre fonctionnalités (rouge) */}
            <div className="button-group"> {/* Conteneur pour les boutons */}
                <Button variant="outline" className="button-small" onClick={getNotifications}>Notifications</Button>
                <Button variant="outline" className="button-small" onClick={getFriends}>Friends</Button>
                <Button variant="outline" className="button-small" onClick={getBlock}>Blocked</Button>
                <Button variant="outline" className="button-small" onClick={getChannel}>Channel</Button>
            </div>
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
                        value={addChannel}
                        onChange={(e) => setaddChannel(e.target.value)}
                        placeholder="Channel Name"
                        className="input-small"
                    />
                    <Button variant="outline" className="button-small" onClick={handleCreateChannel}>Create Channel</Button>
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
                        value={addInput}
                        onChange={(e) => setaddInput(e.target.value)}
                        placeholder="Channel Name"
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