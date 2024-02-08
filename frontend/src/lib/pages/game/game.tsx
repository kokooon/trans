import { useState, useEffect } from 'react';
import CanvasTutorial from './CanvasTutorial.tsx';
import { useSocket } from '../../components/utils/socketContext';
import { Button } from "@/lib/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails, isTokenValid, isUserConnected } from '../../components/utils/UtilsFetch';

function Game() {
  const { socket } = useSocket(); // Récupérer le socket depuis le contexte
  //const [user, setUser] = useState<any | null>(null);
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
    socket.on('game:created', (newGame) => {
      // Traitement des données reçues (newGame)
      console.log('New game created:', newGame);
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
    <div>
      <h1>Pong Game</h1>
      {matchmakingStatus === 'searching' && <p>Recherche d'un adversaire...</p>}
      {matchmakingStatus !== 'found' && (
        <div className="flex flex-col items-center justify-center flex-1">
          <Button 
            variant="outline"
            className="osef"
            onClick={startMatchmaking}
          >
            <p>Play !</p>
          </Button>
        </div>
      )}
      {matchmakingStatus === 'found' && <CanvasTutorial socket={socket}/>}
    </div>
  );
}

export default Game;