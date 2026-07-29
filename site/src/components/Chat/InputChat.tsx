import './InputChat.css';

import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import SendButton from '../buttons/SendButton';

import cornUL from '../../assets/chat/corner_UL.png';
import cornUR from '../../assets/chat/corner_UR.png';
import cornDL from '../../assets/chat/corner_DL.png';
import cornDR from '../../assets/chat/corner_DR.png';
import cornULfocus from '../../assets/chat/corner_focus_UL.png';
import cornURfocus from '../../assets/chat/corner_focus_UR.png';
import cornDLfocus from '../../assets/chat/corner_focus_DL.png';
import cornDRfocus from '../../assets/chat/corner_focus_DR.png';


const defaultInputStyles = {
  '--corner-ul': `url(${cornUL})`,
  '--corner-ur': `url(${cornUR})`,
  '--corner-dl': `url(${cornDL})`,
  '--corner-dr': `url(${cornDR})`,
} as React.CSSProperties;

const focusedInputStyles = {
  '--corner-ul': `url(${cornULfocus})`,
  '--corner-ur': `url(${cornURfocus})`,
  '--corner-dl': `url(${cornDLfocus})`,
  '--corner-dr': `url(${cornDRfocus})`,
} as React.CSSProperties;

export function InputBar() {
  const chatContext = useContext(ChatContext);
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  if (!chatContext) {
    return null;
  }

  const { sendMessage } = chatContext;

  const handleSending = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (inputText.trim() === '') {
      return;
    }
    await sendMessage(inputText);
    setInputText('');
  };

  return (
    <form onSubmit={handleSending} className="response-container">
        <div className="input-container"
            style={isFocused? focusedInputStyles: defaultInputStyles}>
            <div className="input-upperLeft" />
            <div className="input-upperMiddle"/>
            <div className="input-upperRight" />
            <div className="input-middleLeft" />
            <div className="input-middleMiddle">
                
                <input
                    id="chat-input"
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    autoComplete="off"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </div>
            <div className="input-middleRight" />
            <div className="input-bottomLeft" />
            <div className="input-bottomMiddle"/>
            <div className="input-bottomRight" />
        </div>
        <SendButton />
    </form>
  );
}