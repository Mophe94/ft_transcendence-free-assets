import NewChat from '../components/Chat/Chat';
import { ChatProvider } from '../context/ChatProvider';

export function Test() {
    return (
        <ChatProvider>
            <NewChat />
        </ChatProvider>
    );
}