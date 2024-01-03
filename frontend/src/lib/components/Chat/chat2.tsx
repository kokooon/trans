
//import React from 'react';
import { useEffect, useState } from 'react';
import { fetchUserDetails } from '../utils/UtilsFetch';
import { Button } from "@/lib/components/ui/button";
import { AddFriends } from '@/lib/components/ui/AddFriends';

function FChat2() {
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
        <Button variant="ghost" style={{ marginRight: '50px' }} className="relative h-10 w-10 rounded mx-1">Blocked</Button>
        <div style={{ marginRight: '20px' }}>
          <AddFriends />
        </div>
      </div>

      {/* Ajout des deux colonnes ici */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        marginTop: '20px',
      }}>
        {/* Colonne rouge à gauche */}
        <div style={{
          flex: 1,
          backgroundColor: 'red',
          height: '100px', // Hauteur exemple
          marginRight: '10px', // Espacement entre les colonnes
        }}>
          {/* Contenu de la colonne rouge */}
        </div>

        {/* Colonne verte à droite */}
        <div style={{
          flex: 1,
          backgroundColor: 'green',
          height: '100px', // Hauteur exemple
        }}>
          {/* Contenu de la colonne verte */}
        </div>
      </div>
    </div>
  );
}

export function Chat2() {
  return (
    <div className="fixed right-0" style={{ height: '75px', width: '45rem', backgroundColor: '#e5e7eb', zIndex: 50, top: '180px' }}>
      <FChat2 />
    </div>
  );
}
