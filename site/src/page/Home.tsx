import Chat from '../components/chat/Chat';
import { Lobby } from '../components/Lobby';
import { ChatProvider } from '../context/ChatProvider';

export default function Home() {
  return (
    <div className="grid grid-cols-[3fr_1fr]">
      <div className='grid-cols-full'>
        <Lobby />
      </div>
    </div>
  );
}
