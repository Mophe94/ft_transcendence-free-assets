import './SaveButton.css';

import { useState } from 'react';


import saveBtn from '../../assets/buttons/save_button.png';
import saveBtnHover from '../../assets/buttons/save_button_hover.png';
import saveBtnPressed from '../../assets/buttons/save_button_pressed.png';

interface SaveButtonProps {
  onClick: () => void | Promise<void>;
}

export default function SaveButton({ onClick }: SaveButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const prefStyles = {
    '--img-save' : `url(${saveBtn})`,
    '--img-save-hover' : `url(${saveBtnHover})`,
    '--img-save-pressed' : `url(${saveBtnPressed})`,
  } as React.CSSProperties;

  const handleClick = async () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

    await onClick();
  };

  return (
    <button
        style={prefStyles}
        className={`save-button ${isPressed ? 'pressed': ''}`}
        onClick={handleClick}
        aria-label='Save'
        type="submit"
    />
  )
}