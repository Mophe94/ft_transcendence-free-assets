import './Play.css'
import { Game } from '../components/Game'
import { ChatProvider } from '../context/ChatProvider'
import Chat from '../components/Chat/Chat'

export default function Play () {
    return (
        <div className="game-area">
            {/* <Game /> */}
            <ChatProvider>
                <Chat />
            </ChatProvider>
        </div>
    )
}