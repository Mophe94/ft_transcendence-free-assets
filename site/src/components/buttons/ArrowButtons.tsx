import { useState } from "react";
import './ArrowButtons.css';

import leftArrow from "../../assets/buttons/left_arrow.png";
import leftArrowDisabled from "../../assets/buttons/left_arrow_disabled.png";
import leftArrowPressed from "../../assets/buttons/left_arrow_pressed.png";

import rightArrow from "../../assets/buttons/right_arrow.png";
import rightArrowDisabled from "../../assets/buttons/right_arrow_disabled.png";
import rightArrowPressed from "../../assets/buttons/right_arrow_pressed.png";

interface ArrowProps {
  onClick: () => void,
  disabled?: boolean,
}

export const LeftArrowButton = ({ onClick, disabled = false }: ArrowProps) => {
  const [isPressed, setIsPressed] = useState(false);
  let buttonImg = leftArrow;

  if(disabled)
    buttonImg = leftArrowDisabled;
  else if (isPressed)
    buttonImg = leftArrowPressed;

  const handleClick = () => {
    if (disabled)
      return ;
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
    onClick();
  }
    
  return (
    <button
      type="button"
      className="arrow-button"
      onClick={handleClick}
      disabled={disabled}
      aria-label="previous"
    >
      <img src={ buttonImg }/>
    </button>
  );
}

export const RightArrowButton = ({ onClick, disabled = false }: ArrowProps) => {
  const [isPressed, setIsPressed] = useState(false);
  let buttonImg = rightArrow;

  if(disabled)
    buttonImg = rightArrowDisabled;
  else if (isPressed)
    buttonImg = rightArrowPressed;

  const handleClick = () => {
    if (disabled)
      return ;
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
    onClick();
  }
    
  return (
    <button
      type="button"
      className="arrow-button clean-btn"
      onClick={handleClick}
      disabled={disabled}
      aria-label="previous"
    >
      <img src={ buttonImg }/>
    </button>
  );
}
