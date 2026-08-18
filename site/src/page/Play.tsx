import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameIframe from '../content/GameIframe';
import GameRoom from '../content/GameRoom';
import { useLobbySocket } from '../context/LobbySocketContext';
import Heading from '../components/heading/Heading';

export default function Play() {
  const { roomId, players, roomCapacity, timer, gameStarted, reset } = useLobbySocket();
  const navigate = useNavigate();


  useEffect(() => {
    if (!roomId) navigate('/home');
  }, [roomId, navigate]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  if (!roomId) return null;

  if (gameStarted) {
    return <GameIframe userToken="game" roomToken={roomId} />;
  }

  return (
    <>
      <GameRoom
        roomName={roomId}
        players={players}
        roomCapacity={roomCapacity}
        endTime={timer}
      />
    </>
  );
}