import './SendButton.css';

import { useState } from 'react';
import sendBtn from '../../assets/buttons/send_button/send_button.png';
import sendBtnHover from '../../assets/buttons/send_button/send_button_hover.png';
import sendBtnPressed from '../../assets/buttons/send_button/send_button_pressed.png';

export default function SendButton() {
  const [isPressed, setIsPressed] = useState(false);

  const prefStyles = {
    '--img-save' : `url(${sendBtn})`,
    '--img-save-hover' : `url(${sendBtnHover})`,
    '--img-save-pressed' : `url(${sendBtnPressed})`,
  } as React.CSSProperties;

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
  };

  return (
    <button
        style={prefStyles}
        className={`send-button ${isPressed ? 'pressed': ''}`}
        onClick={handleClick}
        aria-label='Save'
        type="submit"
    />
  )
}