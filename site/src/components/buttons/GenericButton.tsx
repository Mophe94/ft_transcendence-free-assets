import { ButtonColor } from "../../constants/Colors";

import buttonRed from '../../assets/buttons/enter_button/enter_button.png';
import buttonRedPressed from '../../assets/buttons/enter_button/enter_button_pushed.png';


interface ButtonProps {
  color: ButtonColor;
  func: () => void
}

export default function GenericButton({color, func}: ButtonProps) {
  let button = buttonRed;
  let buttonPressed = buttonRedPressed;
    if (color === ButtonColor.Red) {
      button = buttonRed;
      buttonPressed = buttonRedPressed;
    }
  return (
    <button onClick={func}><img src={button}/>Enter</button>
  )
}