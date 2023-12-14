// import { useState, useEffect } from 'react';
// import { useCookies } from 'react-cookie';
// import { useNavigate } from 'react-router-dom';

export async function fetchUserDetailsByPseudo(pseudo: string) {
  try {
    const response = await fetch(`http://127.0.0.1:3001/users/${pseudo}`);
    
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

export async function fetchAvatarByPseudo(pseudo: string) {
  try {
    const response = await fetch(`http://127.0.0.1:3001/users/${pseudo}/avatar`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user avatar');
    }

    const avatarData = await response.json();
    return avatarData.avatar;
  } catch (error) {
    console.error('Error fetching user avatar:', error);
    return null;
  }
}

export async function fetchUserDataAndAvatar(pseudo: string): Promise<{ userData: User | null, avatarData: string | null }> {
    try {
      const userData = await fetchUserDetailsByPseudo(pseudo);
      const avatarData = await fetchAvatarByPseudo(pseudo);
      return { userData, avatarData };
    } catch (error) {
      console.error('Error fetching data:', error);
      return { userData: null, avatarData: null };
    }
  }
  
  export function isTokenValid(token: string | undefined): boolean {
    return !!token; // Vous pourriez avoir une logique plus complexe ici
  }
  
