import Chat from '../components/Chat/Chat';
import { Lobby } from '../components/Lobby';
import { ChatProvider } from '../context/ChatProvider';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <Lobby />
      <ChatProvider>
        <Chat />
      </ChatProvider>
    </div>
  );
}
