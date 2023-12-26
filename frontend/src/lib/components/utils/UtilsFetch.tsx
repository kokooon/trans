// import { useState, useEffect } from 'react';
//import { useCookies } from 'react-cookie';
// import { useNavigate } from 'react-router-dom';
//import { User } from '../user.model.tsx';

// export async function fetchUserDetailsByPseudo(pseudo: string) {
//   try {
//     const response = await fetch(`http://127.0.0.1:3001/users/${pseudo}`);
    
//     if (!response.ok) {
//       throw new Error('Failed to fetch user details');
//     }

//     const userData = await response.json();
//     return userData;
//   } catch (error) {
//     console.error('Error fetching user details:', error);
//     return null;
//   }
// }

export async function fetchUserDetails() {
  try {
      const response = await fetch(`http://127.0.0.1:3001/users/cookie`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
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

// export async function fetchAvatarByPseudo(pseudo: string) {
//   try {
//     const response = await fetch(`http://127.0.0.1:3001/users/${pseudo}/avatar`);
    
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

  export async function isTokenValid():Promise<boolean> {
    try {
      const response = await fetch(`http://127.0.0.1:3001/users/check`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        return true;
      } 
      else
        return false;
    } 
    catch (error) {
      console.error('Error fetching user details:', error);
      return false;
    }
}
  
