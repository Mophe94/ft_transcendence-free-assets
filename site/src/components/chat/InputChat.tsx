import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import SendButton from '../buttons/SendButton';

import cornUL from '../../assets/chat/corner_UL.png';
import cornUR from '../../assets/chat/corner_UR.png';
import cornBL from '../../assets/chat/corner_BL.png';
import cornBR from '../../assets/chat/corner_BR.png';
import cornULfocus from '../../assets/chat/corner_focus_UL.png';
import cornURfocus from '../../assets/chat/corner_focus_UR.png';
import cornBLfocus from '../../assets/chat/corner_focus_BL.png';
import cornBRfocus from '../../assets/chat/corner_focus_BR.png';


const defaultInputStyles = {
  '--corner-ul': `url(${cornUL})`,
  '--corner-ur': `url(${cornUR})`,
  '--corner-bl': `url(${cornBL})`,
  '--corner-br': `url(${cornBR})`,
} as React.CSSProperties;

const focusedInputStyles = {
  '--corner-ul': `url(${cornULfocus})`,
  '--corner-ur': `url(${cornURfocus})`,
  '--corner-bl': `url(${cornBLfocus})`,
  '--corner-br': `url(${cornBRfocus})`,
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
    <form
      onSubmit={handleSending}
      className="
        grid
        justify-center w-full
        min-[496px]:grid-cols-[1fr_135px]
        min-[768px]:grid-cols-[1fr]
        min-[1028px]:grid-cols-[1fr_135px]">
      <div
        className="grid gap-0 grid-cols-[21px_1fr_21px] grid-rows-[25px_1fr_25px]"
        style={isFocused? focusedInputStyles: defaultInputStyles}>
  
        <div className="bg-[image:var(--corner-ul)] bg-no-repeat" />
        <div/>
        <div className="bg-[image:var(--corner-ur)] bg-no-repeat bg-size[auto_100%]" />
        <div/>
        <div>
          <input
            id="chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            autoComplete="off"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className='text-black font-ubuntu w-full border-none outline-none'
          />
        </div>
        <div/>
        <div className="bg-[image:var(--corner-bl)] bg-no-repeat" />
        <div/>
        <div className="bg-[image:var(--corner-br)] bg-no-repeat" />
      </div>
      <div className='flex justify-center self-center h-16'>
        <SendButton />
      </div>
    </form>
  );
}