import { useState } from 'react';


import resetBtn from '../../assets/buttons/reset_button/reset_button.png';
import resetBtnHover from '../../assets/buttons/reset_button/reset_button_hover.png';
import resetBtnPressed from '../../assets/buttons/reset_button/reset_button_pressed.png';

interface ResetButtonProps {
  onClick: () => void | Promise<void>;
}

export default function ResetButton({ onClick }: ResetButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const prefStyles = {
    '--img-reset' : `url(${resetBtn})`,
    '--img-reset-hover' : `url(${resetBtnHover})`,
    '--img-reset-pressed' : `url(${resetBtnPressed})`,
  } as React.CSSProperties;

  const handleClick = async () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

    await onClick();
  };

  return (
    <button
        style={prefStyles}
        className={`
          w-full
          aspect-23/14
          bg-no-repeat
          bg-contain
          bg-center
          ${isPressed ? 'bg-(image:--img-reset-pressed)': 'bg-(image:--img-reset) hover:bg-(image:--img-reset-hover)'}`}
        type="button"
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onClick={handleClick}
        aria-label='Reset'
    />
  )
}