import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/nav-bar/NavBar';
import { ChatProvider } from '../context/ChatProvider';
import Chat from '../components/chat/Chat';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function AppLayout() {
  const { theme } = useTheme();
  return (
    <div
      className='relative min-h-screen flex flex-col'
      style={{ backgroundImage: `url(${theme.bgImg})`, backgroundColor: theme.bgColor }}>
      <div>
        <NavBar />
        <div className="w-[min(95vw,1500px)] mt-8 mx-auto flex flex-col">
          <Outlet />
        </div>
        <ChatProvider>
          <Chat />
        </ChatProvider>
      </div>
      <Footer/>
    </div>
  );
}