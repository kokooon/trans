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
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
  
  


function UserAv() {

    const [, , removeCookie] = useCookies(['userToken']);
    const navigate = useNavigate();

    const username = 'gaetan';

    const handleLogout = () => {
        removeCookie('userToken');
        navigate('/login');
      };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://cdn.intra.42.fr/users/92731bef5d53f8af1ed11fd026274345/gmarzull.jpg" alt="@shadcn"/>
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{username}</p>
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