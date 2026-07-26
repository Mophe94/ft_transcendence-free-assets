import Chat from '../components/Chat/Chat';
import { Lobby } from '../components/Lobby';
import { NewLobby } from '../components/NewLobby';
import { ChatProvider } from '../context/ChatProvider';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <NewLobby />
      <ChatProvider>
        <Chat />
      </ChatProvider>
    </div>
  );
}
