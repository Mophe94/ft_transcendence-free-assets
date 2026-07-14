import { useEffect, useRef, useState } from 'react';
import './Play.css';

export function Play() {
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [roomToken, setRoomToken] = useState<string | null>(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_LOBBY_SERVICE}`);

    ws.onopen = () => {
      console.log('Connexion WebSocket établie');
      ws.send(JSON.stringify({ event: 'lobby' }));
    };

    ws.onmessage = (event) => {
      console.log('yes');
      const nouveauMessage = JSON.parse(event.data);
      if (nouveauMessage.event === 'game') {
        console.log(nouveauMessage);
        setUserToken(nouveauMessage.event);
        setRoomToken('test-room');

        setTimeout(() => {
          setGameStart(true);
        }, 2000);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendTokenToGame = () => {
    console.log('function called');
    if (gameStart && iframeRef?.current && userToken && roomToken) {
      console.log('sent');
      console.log(`${import.meta.env.VITE_DOMAIN_NAME}`);
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'SET_GAME_TOKEN',
          token: { user_token: userToken, room_token: roomToken , domain_token: `${import.meta.env.VITE_DOMAIN_NAME}`},
        },
        `${import.meta.env.VITE_IFRAME_SERVICE}`,
      );
    }
  };
  const iframe_src = `${import.meta.env.VITE_IFRAME_SERVICE}/Export_test.html`;
  return (
    <div className="game-area">
      {gameStart && (
        <iframe
          ref={iframeRef}
          src={iframe_src}
          onLoad={sendTokenToGame}
          title="Godot Game"
          scrolling="no"
        />
      )}
    </div>
  );
}
