import { useEffect, useState } from 'react';
import { fetchUserDetails } from '../../components/utils/UtilsFetch';
//import { fetchAvatarByPseudo } from '../utils/UtilsFetch';
//import { User } from '../settings/user.model.tsx';
import { Button } from "@/lib/components/ui/button";
//import { AddFriends } from '@/lib/components/ui/AddFriends';
import { UserNav } from '@/lib/components/ui/user-nav';
//import { useCookies } from 'react-cookie';
//import { useNavigate } from 'react-router-dom';

const social = () => {
    const [currentView, setCurrentView] = useState('Notifications');
    const [Lists, setLists] = useState<string[]>([]);
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => {
          const userData = await fetchUserDetails();
          setUser(userData); 
        };
        fetchData();
    }, []);


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

    return (
        <div>
            <UserNav />
            <div style={{ display: 'flex', justifyContent: 'start', gap: '100px', marginBottom: '20px' }}>
                {/* Boutons */}
                <Button variant="outline" className="osef" onClick={getNotifications}><p>Notifications</p></Button>
                <Button variant="outline" className="osef" onClick={getFriends}><p>Friends</p></Button>
                <Button variant="outline" className="osef" onClick={getBlock}><p>Blocked</p></Button>
            </div>
    
            {/* Render Lists */}
            <ul>
                {Lists.map((item, index) => (
                    <li key={index}>
                        {item}
                        {/* Afficher les boutons uniquement pour Notifications */}
                        {currentView === 'Notifications' && (
                            <>
                                <Button 
                                    variant="outline" 
                                    style={{ backgroundColor: 'white', color: 'green', marginLeft: '10px' }}
                                    onClick={() => handleAccept(item)}
                                >
                                    <span role="img" aria-label="accept">✔️</span>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    style={{ backgroundColor: 'white', color: 'red', marginLeft: '10px' }}
                                    onClick={() => handleDecline(item)}
                                >
                                    <span role="img" aria-label="decline">❌</span>
                                </Button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
    
}
export default social;