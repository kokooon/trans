import { useEffect, useState} from 'react';
import { UserNav } from '@/lib/components/ui/user-nav';
import { fetchUserDetails, fetchUserDetailsByPseudo, isTokenValid, isUserConnected } from '@/lib/components/utils/UtilsFetch';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../../components/utils/socketContext';
import "../../styles/profile.css"

type Games = {
    winner: string,
    looser: string,
    scoreWinner: number,
    scoreLoser: number
  }

type History = {
	game: Games[]
}

const Profile = () => {
    const [GameHistory, setGameHistory] = useState<History | null>(null);
    const navigate = useNavigate();
    const [user, setUser] = useState<any | null>(null);
    const { pseudo } = useParams();
    const { socket } = useSocket();

    useEffect(() => {
        const fetchHistory = async () => {
            console.log('inside fetch history');
            if (pseudo) {
                const user = await fetchUserDetailsByPseudo(pseudo);
                const response = await fetch(`http://127.0.0.1:3001/games/returnHistory/${user.id}`, {
    		    method: 'GET',
    		    headers: {
      		    'Content-Type': 'application/json',
    		    },
    		    credentials: 'include',
  		        });
		        if (response.ok) {
                    const data = await response.json();
                    console.log('history = ', data);
                    setGameHistory(data);
                    GameHistory;
                }
                else {
                    console.log('history empty');
                }
            }
        }
        const checkToken = async () => {
            try {
                const isValid = await isTokenValid();
                if (!isValid) {
                    navigate('/login');
                    return;
                }

                const userData = await fetchUserDetails();
                console.log(pseudo);
                if (pseudo !== null && pseudo !== undefined){
                    console.log(pseudo);
                    const profilData = await fetchUserDetailsByPseudo(pseudo);
                    if (profilData)
                        setUser(profilData);
                }

                if (userData[0].is2FAEnabled !== false) {
                    const isConnected = await isUserConnected();
                    console.log(isConnected);
                    if (!isConnected) {
                        navigate('/2fa');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                // Handle errors here
            }
        };
        fetchHistory();
        checkToken();
    }, [navigate]);

    const handleadd = async () => {
        try {
            const userData = await fetchUserDetails();
          const response = await fetch('http://127.0.0.1:3001/users/FriendRequest', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ addFriend: user.pseudo, userId: userData[0].id }),
          });
      
          if (!response.ok) {
            throw new Error('La réponse du réseau n’était pas correcte');
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour du pseudo :', error);
        }
        let messagedata = {
          recipientId: user.pseudo
            };
          if (socket) {
            socket.emit('new_notification', messagedata);
        } else {
            console.error('Socket is null');
        }
      };

    return (
        <div className="menugrid">
            <video aria-hidden="true" role="presentation" className="videobg" preload="metadata" autoPlay loop muted>
                <source src="https://assets.codepen.io/263256/menubg.mp4" />
            </video>
        <div className="min-h-screen flex flex-col">
        <div className="absolute top-10 right-0"><UserNav/></div>
        <div className="center flex items-center justify-center min-h-screen text-[#9e9cb6]">
    <section className="w-full max-w-[430px] relative bg-[#231f39]/60 rounded-[6px] shadow-[0px_15px_39px_16px_rgba(52,45,91,0.65)] backdrop-blur-sm mx-2 overflow-hidden">
        <a href="" target="_blank" className="">
            <img src={user && user.avatar ? user.avatar || 'placeholder_url' : 'placeholder_url'} className="rounded-full w-[120px] mx-auto my-10 p-0 border-[6px] box-content border-[#231f39] shadow-[0px_27px_16px_-11px_rgba(31,27,56,0.25)] transition-all duration-150 ease-in hover:scale-105 cursor-pointer slide-in-elliptic-top-fwd" />
        </a>
        <h1 className="text-xl font-bold text-center">{user && user.pseudo ? user.pseudo : 'Unknown User'}</h1>
        <small className="block my-1 text-center">{user && user.pseudo_42 ? user.pseudo_42 : 'Unknown User'}</small>
        <p className="mt-5 text-center">Level 42</p>
        <div className="flex items-center justify-center gap-2 w-[80%] mx-auto mt-5 mb-10">
            <button className="flex-1 border border-[#231f39] rounded-[4px] py-3 text-white bg-[#231f39] transition-all duration-150 ease-in hover:bg-[#472e99]" onClick={handleadd}>Add Friend</button>
            <button className="flex-1 border border-[#231f39] text-[#ffffff] rounded-[4px] py-3 transition-all duration-150 ease-in hover:bg-[#472e99]  hover:text-white">Invite Game</button>
        </div>
        <div className="bg-[#1e1a36]/70 p-4 text-sm font-semibold backdrop-blur-sm">
            <p>Match History</p>
            <ul className="flex mt-4 flex-wrap items-center justify-start gap-2 gap-y-3">
                <li className="match-item">
                    <img src={user && user.avatar ? user.avatar || 'placeholder_url' : 'placeholder_url'} alt="" className="avatar"/>
                    <span className="username">joberle</span>
                    <span className="score player1">5</span>
                    <span className="score-separator">-</span> 
                    <span className="score player2">3</span> 
                    <span className="username">joberle</span>
                    <img src={user && user.avatar ? user.avatar || 'placeholder_url' : 'placeholder_url'} alt="" className="avatar"/>
                </li>
            </ul>
        </div>
    </section>
</div>
        </div>
        </div>
    );
}

export default Profile;