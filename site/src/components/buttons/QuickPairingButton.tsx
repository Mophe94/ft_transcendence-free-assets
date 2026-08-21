import { useState } from 'react';

import quickBtn from '../../assets/buttons/quick_pairing_button/quick_pairing_button_regular.png';
import quickBtnHover from '../../assets/buttons/quick_pairing_button/quick_pairing_button_hover.png';
import quickBtnPressed from '../../assets/buttons/quick_pairing_button/quick_pairing_button_pressed.png';

interface QuickButtonProps {
  onClick: () => void | Promise<void>;
}

export default function QuickPairingButton({ onClick }: QuickButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const prefStyles = {
    '--img-quick' : `url(${quickBtn})`,
    '--img-quick-hover' : `url(${quickBtnHover})`,
    '--img-quick-pressed' : `url(${quickBtnPressed})`,
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
          aspect-3/1
          bg-no-repeat
          bg-contain
          bg-center
          ${isPressed ? 'bg-(image:--img-quick-pressed)': 'bg-(image:--img-quick) hover:bg-(image:--img-quick-hover)'}`}
        type="button"
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onClick={handleClick}
        aria-label='Quick pairing'
    />
  )
}