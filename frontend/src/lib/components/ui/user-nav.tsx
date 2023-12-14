import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/lib/components/ui/avatar"
  import { Button } from "@/lib/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/lib/components/ui/dropdown-menu"
//   import { useEffect } from 'react';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetailsByPseudo, fetchAvatarByPseudo } from "@/lib/components/utils/UtilsFetch";

function UserAv() {

    const [, , removeCookie] = useCookies(['userToken']);
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [cookies] = useCookies(['userPseudo']);
    const pseudo = cookies.userPseudo || '';

    useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserDetailsByPseudo(pseudo.toString());
      setUser(userData);

      const avatarData = await fetchAvatarByPseudo(pseudo.toString());
      setAvatar(avatarData);
    };

    fetchData();
  }, [pseudo]);

    const handleLogout = () => {
        removeCookie('userToken');
        navigate('/login');
      };

    return (
      <DropdownMenu>
        {/* <div>
          {user ? (
            <>
            <p>Username: {user.pseudo}</p>
            <p>Email: {user.email}</p>
            </>
            ) : (
            <p>User unknown</p>
            )}
        </div> */}
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {/* Utiliser l'avatar récupéré */}
            <AvatarImage src={avatar || 'placeholder_url'} alt={user?.pseudo || 'Unknown User'} />
            <AvatarFallback>{user?.pseudo?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user && user.pseudo ? user.pseudo : 'Unknown User'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/')}>
            Home
          </DropdownMenuItem>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  export function UserNav() {
    return (
      <div className="flex items-start justify-between p-4">
      <div className="ml-auto">
        <UserAv />
      </div>
    </div>
    )
  }