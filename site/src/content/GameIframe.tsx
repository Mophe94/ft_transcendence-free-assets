
import './GameIframe.css'
import { useRef } from 'react';

interface GameIframeProps {
  userToken: string;
  roomToken: string;
}

export default function GameIframe({ userToken, roomToken }: GameIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const sendTokenToGame = () => {
    if (iframeRef?.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          type: 'SET_GAME_TOKEN',
          token: { user_token: userToken, room_token: roomToken , domain_token: `${import.meta.env.VITE_DOMAIN_NAME}`},
        },
        `${import.meta.env.VITE_IFRAME_SERVICE}`,
      );
    }
  };
  const iframeSrc = `${import.meta.env.VITE_IFRAME_SERVICE}/Export_test.html`;
  
  return (
    <div className="game-area">
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        onLoad={sendTokenToGame}
        title="Godot Game"
        scrolling="no"
      />
    </div>
    )
}