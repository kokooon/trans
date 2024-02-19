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

interface Scores {
  A: number;
  B: number;
}

interface GameData {
  game: Game;
  gameinstance: GameInstance;
}


function Game() {
  const { socket } = useSocket(); // Récupérer le socket depuis le contexte
  //const [user, setUser] = useState<any | null>(null);
  const [gameId, setGameId] = useState<number>(0);
  const [scores, setScores] = useState<Scores>({ A: 0, B: 0 });
  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);
  const [matchmakingStatus, setMatchmakingStatus] = useState('pending');

  useEffect(() => {
    playAudio(1);
    playAudio(2);
    const fetchData = async () => {
      try {
        const isValid = await isTokenValid();
        if (!isValid) {
            navigate('/login');
            return;
        }
        const userData = await fetchUserDetails();
        if (userData)
          setUser(userData);
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
      playFx(3);
      setMatchmakingStatus('found');
      setTimeout(() => {stopAudio()}, 500);
    });
    socket.on('matchmaking:searching', () => {
      playFx(2);
      setMatchmakingStatus('searching');
    });
    socket.on('update:B_scored', () => {
      setScores(prevScores => ({
        ...prevScores,
        B: prevScores.B + 1 // Increment B's score by 1
      }));
    });
  
    socket.on('update:A_scored', () => {
      setScores(prevScores => ({
        ...prevScores,
        A: prevScores.A + 1 // Increment A's score by 1
      }));
    });
    socket.on('game:created', (newGame: GameData) => {
      console.log('New game created:', newGame);
      // Assuming CanvasTutorial can accept a gameId prop
      console.log('data = ', newGame);
      setGameId(newGame.game.id); // Update local state or context with gameId

    });


    return () => {
      // Nettoyage des écouteurs d'événements lors du démontage du composant
      socket.off('update:A_scored');
      socket.off('update:B_scored');
      socket.off('matchmaking:found');
      socket.off('matchmaking:searching');
      socket.off('game:created');
    };
  }, [socket, scores]);

  const startMatchmaking = () => {
    setMatchmakingStatus('searching');
    if (socket)
    {
      console.log('matchmaking sent');
      //const data = { user };
      socket.emit('matchmaking:request');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3001/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId: user[0].id, }),
      });
      if (response.ok) {
        if (socket) {
          socket.disconnect(); // Disconnect the socket
        }
        navigate('/login'); // Redirect to login page after logout
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  function playAudio(nb: number) {
    var audio 
    if (nb == 1)
      audio = document.getElementById("audioElement") as HTMLMediaElement;
    if (nb == 2)
      audio = document.getElementById("space") as HTMLMediaElement;
    
    if (audio && nb == 1) {
      audio.volume = 0.8;
      audio.play();
    }
    if (audio && nb == 2) {
      audio.volume = 0.2;
      audio.play();
    }
  }
  function playFx(nb: number) {
    var audio
    if (nb == 1)
      audio = document.getElementById("fx") as HTMLMediaElement;
    if (nb == 2)
      audio = document.getElementById("look") as HTMLMediaElement;
    if (nb == 3)
      audio = document.getElementById("find") as HTMLMediaElement;
    
    if (audio) {
      audio.volume = 0.4;
      audio.play();
    }
  }
  function stopAudio() {
    var audio = document.getElementById("audioElement") as HTMLMediaElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  function stopFx() {
    var audio = document.getElementById("fx") as HTMLMediaElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  return (
    <div className="menugrid">
      <audio id="audioElement" preload="auto" src="../../../../public/assets/music.mp3"></audio>
      <audio id="space" preload="auto" src="../../../../public/assets/apollo.mp3"></audio>
      <audio id="fx" preload="auto" src="../../../../public/assets/fx.wav"></audio>
      <audio id="look" preload="auto" src="../../../../public/assets/look.mp3"></audio>
      <audio id="find" preload="auto" src="../../../../public/assets/find.mp3"></audio>
      <video aria-hidden="true" role="presentation" className="videobg" preload="metadata" autoPlay loop muted>
        <source src="https://assets.codepen.io/263256/menubg.mp4" />
      </video>
      <nav className="nav">
      {matchmakingStatus === 'searching' &&<div className="loader"> <p>Recherche d'un adversaire...</p></div>}
      {matchmakingStatus !== 'found' && (
      <div>
        <a  className="nav-link" onMouseEnter={() => playFx(1)} onMouseLeave={stopFx}  onClick={startMatchmaking}><p>Play !</p></a>
        <a  className="nav-link" onMouseEnter={() => playFx(1)} onMouseLeave={stopFx} onClick={() => navigate(`/profile/${user[0].pseudo}`)}><p>Profile</p></a>
        <a  className="nav-link" onMouseEnter={() => playFx(1)} onMouseLeave={stopFx} onClick={() => navigate('/social')}><p>Social</p></a>
        <a  className="nav-link" onMouseEnter={() => playFx(1)} onMouseLeave={stopFx} onClick={() => navigate('/settings')}><p>Settings</p></a>
        <a  className="nav-link" onMouseEnter={() => playFx(1)} onMouseLeave={stopFx} onClick={handleLogout}><p>Exit</p></a>
      </div>
      )}
      {matchmakingStatus === 'found' && 
      <div className="relative w-800 h-500">
          <div>
            <p>Score A: {scores.A}</p>
            <p>Score B: {scores.B}</p>
        </div>
        <video autoPlay muted loop id="background-video"  style={{ position: 'absolute', width: '900px', height: '500px', zIndex: -1 }}>
        <source src="../../../../public/assets/space.mp4" type="video/mp4"/>
        </video>
        <CanvasTutorial socket={socket} gameId={gameId}/>
      </div>
      }
      </nav>
    </div>
  );
}

export default Game;
