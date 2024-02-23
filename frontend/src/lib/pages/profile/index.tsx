import { useEffect, useState} from 'react';
import { UserNav } from '@/lib/components/ui/user-nav';
import { fetchUserDetails, fetchUserDetailsByPseudo, isTokenValid, isUserConnected } from '@/lib/components/utils/UtilsFetch';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../../components/utils/socketContext';
import Notification from '@/lib/components/utils/notif';
import "../../styles/profile.css"

type Games = {
    winner: string,
    looser: string,
    scoreWinner: number,
    scoreLoser: number
    AvatarWin: string;
    AvatarLoose: string;
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
            if (pseudo) {
                const user = await fetchUserDetailsByPseudo(pseudo);
                const response = await fetch(`http://10.13.1.7:3001/games/returnHistory/${user.id}`, {
    		    method: 'GET',
    		    headers: {
      		    'Content-Type': 'application/json',
    		    },
    		    credentials: 'include',
  		        });
		        if (response.ok) {
                    const data = await response.json();
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
                    console.log(profilData);
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
        if (socket) {
            socket.on('gameInvite', () => {
                console.log('in gameInvit in social');
              navigate('/gameInvit');
          });
                return () => {
                    socket.off('gameInvite')
                }
            }
    }, [navigate]);

    const handleadd = async () => {
        try {
            const userData = await fetchUserDetails();
          const response = await fetch('http://10.13.1.7:3001/users/FriendRequest', {
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
            <Notification message="Test" type="success" />
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
        <p className="mt-5 text-center">Level {user && user.level ? user.level : 'Unknown Level'}</p>
        <div className="progress-container mt-5 text-center"><progress className="xp-progress" value={user && user.exp ? user.exp : 0} max={100}></progress></div>
        <p className="mt-5 text-sm text-center">XP: {user && user.exp ? user.exp : 0}/{100}</p>
        <div className="flex items-center justify-center gap-2 w-[80%] mx-auto mt-5 mb-10">
            <button className="flex-1 border border-[#231f39] rounded-[4px] py-3 text-white bg-[#231f39] transition-all duration-150 ease-in hover:bg-[#472e99]" onClick={handleadd}>Add Friend</button>
            <button className="flex-1 border border-[#231f39] text-[#ffffff] rounded-[4px] py-3 transition-all duration-150 ease-in hover:bg-[#472e99]  hover:text-white">Invite Game</button>
        </div>
        <div className="bg-[#1e1a36]/70 p-4 text-sm font-semibold backdrop-blur-sm">
            <p>Match History</p>
            {GameHistory && (
            <ul className="flex mt-4 flex-wrap items-center justify-start gap-2 gap-y-3">
            {GameHistory.game.map((game) => (
                <li className="match-item">
                    <img src={game && game.AvatarWin ? game.AvatarWin || 'placeholder_url' : 'placeholder_url'} alt="" className="avatar" onClick={() => navigate(`/profile/${game.winner}`)} style={{ cursor: 'pointer' }}/>
                    <span className="username">{game.winner.substring(0, 8)}</span>
                    <span className="score player1">{game.scoreWinner}</span>
                    <span className="score-separator"></span> 
                    <span className="score player2">{game.scoreLoser}</span> 
                    <span className="username">{game.looser.substring(0, 8)}</span>
                    <img src={game && game.AvatarLoose ? game.AvatarLoose || 'placeholder_url' : 'placeholder_url'} alt="" className="avatar" onClick={() => navigate(`/profile/${game.looser}`)} style={{ cursor: 'pointer' }}/>
                </li>
            ))}
            </ul>
            )}
        </div>
    </section>
</div>
        </div>
        </div>
    );
}

export default Profile;