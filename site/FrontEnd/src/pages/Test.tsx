import { useEffect, useRef, useState } from 'react';
import './Test.css'

export default function Test () {

    const [gameStart, setGameStart] = useState<boolean>(false);
    const [gameToken, setGameToken] = useState<string | null>(null);
    const iframeRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket(`${import.meta.env.VITE_LOBBY_SERVICE}`);
    
        ws.onopen = () => {
            console.log('Connexion WebSocket établie');
            ws.send(JSON.stringify({ event: 'lobby' }));
        };

        ws.onmessage = (event) => {
            const nouveauMessage = JSON.parse(event.data);
            if (nouveauMessage.event === 'game'){
                console.log(nouveauMessage);

                setGameToken(nouveauMessage.event);
                
                setTimeout(() => {
                    setGameStart(true);
                }, 5000);
            }
        };
    
        return () => {
            ws.close();
        }
        }, [])

    const sendTokenToGame = () => {
        console.log("function called");
        if (gameStart && iframeRef?.current && gameToken) {
            iframeRef.current.contentWindow.postMessage(
                { type: "SET_GAME_TOKEN", token: gameToken }, 
                `http://localhost:8060` 
            );
        }
    }
    return (
        <div className='game-area'>

            {gameStart && (
                <iframe
                    ref={iframeRef}
                    src="http://localhost:8060/Export_test.html"
                    onLoad={sendTokenToGame}
                    title="Godot Game"/>)}
        </div>
    )
}