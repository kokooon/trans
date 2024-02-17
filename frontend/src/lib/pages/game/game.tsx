import { useState, useEffect } from 'react';
import CanvasTutorial from './CanvasTutorial.tsx';
import { useSocket } from '../../components/utils/socketContext';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails, isTokenValid, isUserConnected } from '../../components/utils/UtilsFetch';
import "../../styles/game.css"

interface Game {
  userA: number;
  userB: number;
  scoreA: number;
  scoreB: number;
  id: number;
}

interface GameInstance {
  intervalId: any; // Use a more specific type if available
  gameId: number;
  playerAPosition: { y: number };
  playerBPosition: { y: number };
  ball: {
    x: number;
    y: number;
    dx: number;
    dy: number;
  };
}

interface GameData {
  game: Game;
  gameinstance: GameInstance;
}


function Game() {
  const { socket } = useSocket(); // Récupérer le socket depuis le contexte
  //const [user, setUser] = useState<any | null>(null);
  const [gameId, setGameId] = useState<number>(0);
  const navigate = useNavigate();
  const [matchmakingStatus, setMatchmakingStatus] = useState('pending');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const isValid = await isTokenValid();
        if (!isValid) {
            navigate('/login');
            return;
        }
        const userData = await fetchUserDetails();
        if (userData[0].is2FAEnabled !== false) {
            const isConnected = await isUserConnected();
            console.log(isConnected);
            if (!isConnected) {
                navigate('/2fa');
            }
        }
        //setUser(userData);
        }
        catch (error) {
            console.error('Error:', error);
        }
    };
    fetchData();
    if (!socket) return;

    // Écouter les événements du serveur
    socket.on('matchmaking:found', () => {
      setMatchmakingStatus('found');
    });
    socket.on('matchmaking:searching', () => {
      setMatchmakingStatus('searching');
    });
    socket.on('game:created', (newGame: GameData) => {
      console.log('New game created:', newGame);
      // Assuming CanvasTutorial can accept a gameId prop
      console.log('data = ', newGame);
      setGameId(newGame.game.id); // Update local state or context with gameId

    });


    return () => {
      // Nettoyage des écouteurs d'événements lors du démontage du composant
      socket.off('matchmaking:found');
      socket.off('matchmaking:searching');
      socket.off('game:created');
    };
  }, [socket]);

  const startMatchmaking = () => {
    setMatchmakingStatus('searching');
    if (socket)
    {
      console.log('matchmaking sent');
      //const data = { user };
      socket.emit('matchmaking:request');
    }
  };

  return (
    <div className="menugrid">
      <video aria-hidden="true" role="presentation" className="videobg" preload="metadata" autoPlay loop muted>
        <source src="https://assets.codepen.io/263256/menubg.mp4" />
      </video>
      <nav className="nav">
      {matchmakingStatus === 'searching' &&<div className="loader"> <p>Recherche d'un adversaire...</p></div>}
      {matchmakingStatus !== 'found' && (
      <div>
        <a href="#!" className="nav-link" onClick={startMatchmaking}><p>Play !</p></a>
      </div>
          
      )}
      {matchmakingStatus === 'found' && <CanvasTutorial socket={socket} gameId={gameId}/>}
      </nav>
    </div>
  );
}

export default Game;