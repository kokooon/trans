import { useEffect, useState } from 'react';
import { fetchUserDetails } from '../../components/utils/UtilsFetch';
//import { fetchAvatarByPseudo } from '../utils/UtilsFetch';
import { User } from '../settings/user.model.tsx';
import { Button } from "@/lib/components/ui/button";
//import { AddFriends } from '@/lib/components/ui/AddFriends';
import { UserNav } from '@/lib/components/ui/user-nav';
//import { useCookies } from 'react-cookie';
//import { useNavigate } from 'react-router-dom';

const social = () => {

    const [FriendsLists, setFriendsLists] = useState<User[]>([]); // Utilisation de User[] au lieu de string[]

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchData = async () => {
          const userData = await fetchUserDetails();
          setUser(userData); 
        };
        fetchData();
    }, []);

    const getFriends = async () => {
        try {
            if (user) { // Vérifiez que user est défini
                const friendsList: User[] = [];

                for (let i = 0; i < user.friendNotifications.length; i++) {
                    console.log("i = ", i);
                    const friendId = user.friendNotifications[i];
                    const response = await fetch(`http://127.0.0.1:3001/users/friends/${friendId}`, {
                        method: 'GET',
                        credentials: 'include',
                    });

                    if (response.ok) {
                        const responseData: User = await response.json();
                        friendsList.push(responseData);
                        console.log("user = ", responseData);
                    } else {
                        console.error('Get friends failed for friendId:', friendId);
                    }
                }

                setFriendsLists([...friendsList]);
            }
        } catch (error) {
            console.error('Error during get friends:', error);
        }
    };

    return (
        <div>
            <UserNav />
            <Button variant="outline" className="osef" onClick={getFriends}>
                <p>Friends</p>
            </Button>
            
            {/* Rendu de FriendsLists */}
            <ul>
                {FriendsLists.map((friend, index) => (
                    <li key={index}>
                        <p>ID: {friend.id}</p>
                        <p>Pseudo: {friend.pseudo}</p>
                        <p>Email: {friend.email}</p>
                        {/* Ajoutez d'autres champs d'utilisateur selon vos besoins */}
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default social;