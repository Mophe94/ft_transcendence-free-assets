import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/nav-bar/NavBar';
import { ChatProvider } from '../context/ChatProvider';
import Chat from '../components/chat/Chat';

export default function AppLayout() {
  return (
    <>
      <NavBar />
      <div className="w-[min(95vw,1500px)] mt-8 mx-auto flex flex-col">
        <Outlet />
      </div>
      <ChatProvider>
        <Chat />
      </ChatProvider>
    </>
  );
}