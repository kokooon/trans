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

    const [FriendsLists, setFriendsLists] = useState<string[]>([]);
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => {
          const userData = await fetchUserDetails();
          setUser(userData); 
        };
        fetchData();
    }, []);

    const getFriends = async () => {
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
            setFriendsLists([...friendsList]);
        } catch (error) {
            console.error('Error during get friends:', error);
        }
    }; 

    return (
        <div>
            <UserNav />
            <Button variant="outline" className="osef" onClick={getFriends}>
                <p>Friends!</p>
            </Button>
            
            {/* Render FriendsLists */}
            <ul>
                {FriendsLists.map((friend, index) => (
                    <li key={index}>{friend}</li>
                ))}
            </ul>
        </div>
    );
}
export default social;