import './CreateRoomButton.css'

import { useState } from 'react';

import createBtn from '../../assets/buttons/create_room_button/create_room_button_regular.png';
import createBtnHover from '../../assets/buttons/create_room_button/create_room_button_hover.png';
import createBtnPressed from '../../assets/buttons/create_room_button/create_room_button_pressed.png';

interface QuickButtonProps {
  onClick: () => void | Promise<void>;
}

export default function CreateRoomButton({ onClick }: QuickButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const prefStyles = {
    '--img-create' : `url(${createBtn})`,
    '--img-create-hover' : `url(${createBtnHover})`,
    '--img-create-pressed' : `url(${createBtnPressed})`,
  } as React.CSSProperties;

  const handleClick = async () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

    await onClick();
  };

  return (
    <button
        style={prefStyles}
        className={`create-button ${isPressed ? 'pressed': ''}`}
        type="button"
        onClick={handleClick}
        aria-label='Quick pairing'
    />
  )
}