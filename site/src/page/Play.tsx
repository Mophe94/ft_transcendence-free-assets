import { useEffect, useState } from 'react';
import './Play.css';
import GameIframe from '../content/GameIframe';
import GameRoom from '../content/GameRoom';

export default function Play() {
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [roomToken, setRoomToken] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_LOBBY_SERVICE}`);

    ws.onopen = () => {
      console.log('Connexion WebSocket établie');
      ws.send(JSON.stringify({ event: 'lobby' }));
    };

    ws.onmessage = (event) => {
      const newMsg = JSON.parse(event.data);
      console.log(newMsg);
      if (newMsg.event === 'game') {
        setUserToken(newMsg.event);
        setRoomToken('test-room');

        setTimeout(() => {
          setGameStart(true);
        }, 3000);
      }
      if (newMsg.event === 'lobby') {
        if (newMsg.state === 'player_joined') {
          setTimer(newMsg.data.timer);
          setCapacity(newMsg.data.roomCapacity);
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [capacity]);

  
  if (gameStart && userToken && roomToken) {
    return <GameIframe userToken={userToken} roomToken={roomToken} />
  }

  return (
    <GameRoom {...{ roomName: "Test-room", players: ["kprist", "stempels", "bertrmar", "agaland"], roomCapacity: capacity, endTime: timer } } />
  );
}
