import Chat from '../components/Chat/Chat'
import { Game } from '../components/Game'
import { ChatProvider } from '../context/ChatProvider'
import './Test.css'

export default function Test () {

    return (
        <div className='game-area'>
            <Game />
            <ChatProvider>
                <Chat />
            </ChatProvider>
        </div>
    )
}