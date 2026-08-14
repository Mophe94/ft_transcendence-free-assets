import { useEffect, useRef, useState } from 'react';
import GameIframe from '../content/GameIframe';
import GameRoom from '../content/GameRoom';

export default function Play() {
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [roomToken, setRoomToken] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);

  const gameStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_LOBBY_SERVICE}`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ event: 'lobby' }));
    };

    ws.onmessage = (event) => {
      const newMsg = JSON.parse(event.data);
      if (newMsg.event === 'game') {
        setUserToken(newMsg.event);
        setRoomToken(newMsg.data.roomToken ?? 'test-room');

        if (gameStartTimeoutRef.current) {
          clearTimeout(gameStartTimeoutRef.current);
        }
        gameStartTimeoutRef.current = setTimeout(() => {
          setGameStart(true);
        }, 3000);
      }
      if (newMsg.event === 'lobby' && newMsg.state === 'player_joined') {
          setTimer(newMsg.data.timer);
          setCapacity(newMsg.data.roomCapacity);
      }
    };

     ws.onerror = (err) => {
      console.error('Erreur WebSocket lobby :', err);
    };
    return () => {
      ws.close();
      if (gameStartTimeoutRef.current) {
        clearTimeout(gameStartTimeoutRef.current);
      }
    };
  }, []);

  
  if (gameStart && userToken && roomToken) {
    return <GameIframe userToken={userToken} roomToken={roomToken} />
  }

  return (
    <GameRoom {...{ roomName: "Test-room", players: ["kprist", "stempels", "bertrmar", "agaland"], roomCapacity: capacity, endTime: timer } } />
  );
}
