import { useEffect, useState } from 'react';
import { fetchUserDetails } from '../utils/UtilsFetch';
//import { fetchAvatarByPseudo } from '../utils/UtilsFetch';
//import { User } from './../user.model.tsx';

function FChat() {

    const [user, setUser] = useState<any | null>(null);
    user;
    useEffect(() => {
        const fetchData = async () => {
          const userData = await fetchUserDetails();
          setUser(userData);
        };
        fetchData();
      }, []);

      return (
        <div>Content of FChat</div>
      )
}
export function Chat() {
    return (
        <div className="right-0 h-full w-30 bg-gray-300 position: relative" style={{ zIndex: 50 }}>
          <FChat />
        </div>
      )
}