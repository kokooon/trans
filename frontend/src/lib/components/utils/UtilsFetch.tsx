// import { useState, useEffect } from 'react';
//import { useCookies } from 'react-cookie';
// import { useNavigate } from 'react-router-dom';
//import { User } from '../user.model.tsx';

export async function fetchUserDetailsByPseudo(pseudo: string) {
   try {
     const response = await fetch(`http://10.13.1.7:3001/users/${pseudo}`);
    
     if (!response.ok) {
       throw new Error('Failed to fetch user details');
     }

     const userData = await response.json();
     return userData;
   } catch (error) {
     console.error('Error fetching user details:', error);
     return null;
   }
 }

export async function fetchUserDetails() {
  try {
      const response = await fetch(`http://10.13.1.7:3001/users/cookie`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
  
    // Check if the response has a valid JSON content type
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const userData = await response.json();
      return userData;
    } else {
      // Handle the case where the response is not in JSON format
      console.error('Response is not JSON');
      return null;
    }

  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}

// export async function fetchAvatarByPseudo(pseudo: string) {
//   try {
//     const response = await fetch(`http://10.13.1.7:3001/users/${pseudo}/avatar`);
    
//     if (!response.ok) {
//       throw new Error('Failed to fetch user avatar');
//     }

//     const avatarData = await response.json();
//     return avatarData.avatar;
//   } catch (error) {
//     console.error('Error fetching user avatar:', error);
//     return null;
//   }
// }

export async function isTokenValid(): Promise<boolean> {
  try {
    const response = await fetch(`http://10.13.1.7:3001/users/check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    //console.log('Full response:', response);

    if (response.status === 200) {
      // Statut OK (200), renvoyer true
      return true;
    } else if (response.status === 404) {
      // Statut Created (201), renvoyer false
      return false;
    } else {
      // Autres statuts, gérer selon les besoins
      console.error('Unexpected response status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    return false;
  }
}

  export async function isUserConnected(): Promise<boolean> {
    try {
      const response = await fetch(`http://10.13.1.7:3001/users/check_conection`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      //console.log('Full response:', response);
  
      if (response.status === 200) {
        // Statut OK (200), renvoyer true
        return true;
      } else if (response.status === 404) {
        // Statut Created (201), renvoyer false
        return false;
      } else {
        // Autres statuts, gérer selon les besoins
        console.error('Unexpected response status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      return false;
    }
}
  
