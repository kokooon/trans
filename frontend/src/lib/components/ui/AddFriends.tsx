//import { Button } from "@/lib/components/ui/button"
//import { useEffect, useState } from 'react';
//import { useCookies } from 'react-cookie';
//import { useNavigate } from 'react-router-dom';
//import { fetchUserDetails } from '../utils/UtilsFetch';
//import { fetchUserDetailsByPseudo } from '../utils/UtilsFetch';
//import { User } from './../user.model.tsx';


{/*function AddFriend() {
    const [friendpseudo, setFriendPseudo] = useState<string>('');
    const [, setUser] = useState<any | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await fetchUserDetails();
          if (result && result.length > 0) {
            const userData = result[0];
            setUser(userData);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
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
          body: JSON.stringify({ addFriend: friendpseudo }),
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
  
    const handleFriendPseudo = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFriendPseudo(event.target.value);
    };
  
    return (
      <div className="mb-4">
        <input
          type="text"
          value={friendpseudo}
          onChange={handleFriendPseudo}
          className="border rounded p-2 mr-2"
          placeholder="Friend pseudo"
        />
        <button onClick={handleAddSubmit} className="bg-blue-500 text-white rounded p-2">
          AddFriend
        </button>
      </div>
    );
  }
export function AddFriends() {
    return (
      <div className="flex items-center justify-center p-4 h-screen" style={{alignItems: 'flex-start'}}>
      <div>
        <AddFriend />
      </div>
    </div>
    )
}*/}