import { useEffect, useRef, useState } from 'react';
import './Test.css'

export default function Test () {

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
            console.log("yes");
            const nouveauMessage = JSON.parse(event.data);
            if (nouveauMessage.event === 'game'){
                console.log(nouveauMessage);

                setUserToken(nouveauMessage.event);
                setRoomToken("test-room");
                
                setTimeout(() => {
                    setGameStart(true);
                }, 2000);
                
            }
        };
    
        return () => {
            ws.close();
        }
        }, [])

    const sendTokenToGame = () => {
        console.log("function called");
        if (gameStart && iframeRef?.current && userToken && roomToken) {
            console.log("sent");
            iframeRef.current.contentWindow.postMessage(
                { type: "SET_GAME_TOKEN", token: {"user_token": userToken, "room_token": roomToken }}, 
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
                    title="Godot Game"
                    height="820"
                    width="1272"/>)}
        </div>
    )
}