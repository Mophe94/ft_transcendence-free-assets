import { useState } from 'react';
import sendBtn from '../../assets/buttons/send_button/send_button.png';
import sendBtnHover from '../../assets/buttons/send_button/send_button_hover.png';
import sendBtnPressed from '../../assets/buttons/send_button/send_button_pressed.png';

export default function SendButton() {
  const [isPressed, setIsPressed] = useState(false);

  const prefStyles = {
    '--img-send' : `url(${sendBtn})`,
    '--img-send-hover' : `url(${sendBtnHover})`,
    '--img-send-pressed' : `url(${sendBtnPressed})`,
  } as React.CSSProperties;

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
  };

  return (
    <button
        style={prefStyles}
        className={`
          h-full
          aspect-105/64
          bg-no-repeat
          bg-contain
          bg-center
          ${isPressed ? 'bg-(image:--img-send-pressed)': 'bg-(image:--img-send) hover:bg-(image:--img-send-hover)'}`}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onClick={handleClick}
        aria-label='Save'
        type="submit"
    />
  )
}