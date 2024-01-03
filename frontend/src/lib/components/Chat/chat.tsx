import { useEffect, useState } from 'react';
import { fetchUserDetails } from '../utils/UtilsFetch';
//import { fetchAvatarByPseudo } from '../utils/UtilsFetch';
//import { User } from './../user.model.tsx';
import { Button } from "@/lib/components/ui/button";
import { AddFriends } from '@/lib/components/ui/AddFriends';

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
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          color: 'black',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingLeft: '20px',
          }}>
            <Button variant="ghost" style={{ marginRight: '20px' }} className="relative h-10 w-10 rounded-full mr-2">Friends</Button>
            <Button variant="ghost" style={{ marginRight: '50px' }} className="relative h-10 w-10 rounded-full mx-1">Channel</Button>
            <Button variant="ghost" style={{ marginRight: '50px' }} className="relative h-10 w-10 rounded-full mx-1">Notifications</Button>
            <Button variant="ghost" style={{ marginRight: '50px' }} className="flex h-10 w-10 rounded mx-1">Blocked</Button>
            <div style={{ marginRight: '20px' }}>
              <AddFriends />
            </div>
          </div>
          <div style={{ 
            height: '4px', // Thickness of the line
            backgroundColor: 'red', // Color of the line
            width: '100%', // Full width
            marginTop: '10px', // Optional margin for spacing
            marginBottom: '10px' // Optional margin for spacing
          }}></div>
          {/* Additional content goes here */}
        </div>
    )
}
export function Chat() {
    return (
      <div className="fixed right-0" style={{ height: '750px', width: '45rem', backgroundColor: '#e5e7eb', zIndex: 50, top: '180px' }}>
          <FChat />
        </div>
      )
}