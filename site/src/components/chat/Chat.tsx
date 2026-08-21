import React, { useContext, useEffect, useRef, useState } from 'react';
import { ChatContext, type Message } from '../../context/ChatContext';
import { InputBar } from './InputChat';

import chatIcon from '../../assets/chat/chat_icon.png';
import chatIconNew from '../../assets/chat/chat_icon_new.png';
import parchUL from '../../assets/background/parchment/parchUL.png';
import parchUM from '../../assets/background/parchment/parchUM.png';
import parchUR from '../../assets/background/parchment/parchUR.png';
import parchML from '../../assets/background/parchment/parchML.png';
import parchMM from '../../assets/background/parchment/parchMM.png';
import parchMR from '../../assets/background/parchment/parchMR.png';
import parchBL from '../../assets/background/parchment/parchBL.png';
import parchBM from '../../assets/background/parchment/parchBM.png';
import parchBR from '../../assets/background/parchment/parchBR.png';
import { useAuth } from '../../context/AuthContext';

const prefStyles = {
  '--img-ul': `url(${parchUL})`,
  '--img-um': `url(${parchUM})`,
  '--img-ur': `url(${parchUR})`,
  '--img-ml': `url(${parchML})`,
  '--img-mm': `url(${parchMM})`,
  '--img-mr': `url(${parchMR})`,
  '--img-bl': `url(${parchBL})`,
  '--img-bm': `url(${parchBM})`,
  '--img-br': `url(${parchBR})`,
} as React.CSSProperties;

const EMPTY_MESSAGES: Message[] = [];

export function MessagesWindow() {
  const chatContext = useContext(ChatContext);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messages = chatContext?.messages ?? EMPTY_MESSAGES;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chatContext) {
    return null;
  }

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden min-w-0 scrollbar-none [&::-webkit-scrollbar]:hidden">
      {messages.length === 0 && <p>Start discussion...</p>}
      {messages.map((msg, index) => {
        return (
            <div className='break-all min-w-0 w-full' key={index}>
              <span>[{msg.time}] </span>
              <span style={{ color: msg.color}}>{msg.username}: </span>
              <span>{msg.content}</span>
            </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default function Chat() {
  const [visible, setVisible] = useState<boolean>(false);
  const chat = useContext(ChatContext);
  const { user } = useAuth();
  
  useEffect(() => {
    if (chat && visible && chat.isUnread)
      chat.setIsUnread(false);
  }, [chat, visible, chat?.isUnread])
  if (!user) return <></>;
  return (
    <>
      <div
        className={`fixed bottom-0 left-0 h-full w-[97vw] md:h-[45vh] md:w-[min(50vw,800px)] gap-0 grid-cols-[98px_1fr_64px] grid-rows-[188px_1fr_172px] z-100 ${visible ? 'grid':'hidden'}`} style={prefStyles}>
        <div className="bg-(image:--img-ul) bg-no-repeat" />
        <div className="bg-(image:--img-um) bg-[round_no-repeat]">
          <div className='font-rocker text-dark-garnet [-webkit-text-stroke:2px_black] justify-self-center text-[64px] pt-10 font-'>Chat</div>
        </div>
        <div className="bg-(image:--img-ur) bg-no-repeat bg-size[auto_100%]" />
        <div className="bg-(image:--img-ml) bg-[no-repeat_round]" />
        <div className="bg-(image:--img-mm) bg-auto bg-repeat-round min-h-0 min-w-0 overflow-hidden pb-2">
          <MessagesWindow />
        </div>
        <div className="bg-(image:--img-mr) bg-[no-repeat_round]" />
        <div className="bg-(image:--img-bl) bg-no-repeat" />
        <div className="bg-(image:--img-bm) bg-[round_no-repeat] flex items-center">
          <InputBar />
        </div>
        <div className="bg-(image:--img-br) bg-no-repeat" />
      </div>
      <button
        id='chat-icon'
        className='fixed bottom-0 right-0 z-200'
        onClick={() => setVisible(!visible)}>
        <img
          className='w-[min(10vw,10vh)]'
          src={chat?.isUnread ? chatIconNew: chatIcon}/>
      </button>
    </>
  );
}
