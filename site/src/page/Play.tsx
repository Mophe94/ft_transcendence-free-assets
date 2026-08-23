import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameIframe from '../content/GameIframe';
import GameRoom from '../content/GameRoom';
import { useLobbySocket } from '../context/LobbySocketContext';
import CountDown from '../components/CountDown';

export default function Play() {
  const { roomId, players, roomCapacity, timer, gameStarted, reset } = useLobbySocket();
  const navigate = useNavigate();
  const [isCountDownFinished, setIsCountDownFinished] = useState(false);


  useEffect(() => {
    if (!roomId) navigate('/home');
  }, [roomId, navigate]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  if (!roomId) return null;

  if (gameStarted && isCountDownFinished) {
    return <GameIframe userToken="game" roomToken={roomId} />;
  }

  return (
    <div className='relative'>
      <GameRoom
        roomName={roomId}
        players={players}
        roomCapacity={roomCapacity}
        endTime={timer}
      />
      {gameStarted && <CountDown initialTime={3} onComplete={() => setIsCountDownFinished(true)}/>}
    </div>
  );
}