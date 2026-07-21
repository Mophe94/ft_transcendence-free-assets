import React, { useContext, useEffect, useRef } from 'react';
import { ChatContext, type Message } from '../../context/ChatContext';
import './Chat.css';

import parchUL from '../../assets/background/parchment/parchUL.png';
import parchUM from '../../assets/background/parchment/parchUM.png';
import parchUR from '../../assets/background/parchment/parchUR.png';
import parchML from '../../assets/background/parchment/parchML.png';
import parchMM from '../../assets/background/parchment/parchMM.png';
import parchMR from '../../assets/background/parchment/parchMR.png';
import parchDL from '../../assets/background/parchment/parchDL.png';
import parchDM from '../../assets/background/parchment/parchDM.png';
import parchDR from '../../assets/background/parchment/parchDR.png';
import { InputBar } from './InputChat';


const prefStyles = {
  '--img-ul': `url(${parchUL})`,
  '--img-um': `url(${parchUM})`,
  '--img-ur': `url(${parchUR})`,
  '--img-ml': `url(${parchML})`,
  '--img-mm': `url(${parchMM})`,
  '--img-mr': `url(${parchMR})`,
  '--img-dl': `url(${parchDL})`,
  '--img-dm': `url(${parchDM})`,
  '--img-dr': `url(${parchDR})`,
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
    <div className="message-container">
      {messages.length === 0 && <p>Start discussion...</p>}
      {messages.map((msg, index) => {
        return (
            <div className='chat-msg' key={index}>
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

export default function NewChat() {
  return (
    <div className="chat-container" style={prefStyles}>
      <div className="chat-upperLeft" />
      <div className="chat-upperMiddle">
        <div className='chat-heading'>Chat</div>
      </div>
      <div className="chat-upperRight" />
      <div className="chat-middleLeft" />
      <div className="chat-middleMiddle">
        <MessagesWindow />
      </div>
      <div className="chat-middleRight" />
      <div className="chat-bottomLeft" />
      <div className="chat-bottomMiddle aligned">
        <InputBar />
      </div>
      <div className="chat-bottomRight" />
    </div>
  );
}
