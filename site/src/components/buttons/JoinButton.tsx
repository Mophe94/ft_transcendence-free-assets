import './JoinButton.css'

import { useState } from 'react';


import joinBtn from '../../assets/buttons/join_button/join_reg.png';
import joinBtnHover from '../../assets/buttons/join_button/join_hover.png';
import joinBtnPressed from '../../assets/buttons/join_button/join_pressed.png';

interface ResetButtonProps {
  onClick: () => void | Promise<void>;
}

export default function JoinButton({ onClick }: ResetButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const prefStyles = {
    '--img-join' : `url(${joinBtn})`,
    '--img-join-hover' : `url(${joinBtnHover})`,
    '--img-join-pressed' : `url(${joinBtnPressed})`,
  } as React.CSSProperties;

  const handleClick = async () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

    await onClick();
  };

  return (
    <button
        style={prefStyles}
        className={`join-button ${isPressed ? 'pressed': ''}`}
        type="button"
        onClick={handleClick}
        aria-label='Join'
    />
  )
}