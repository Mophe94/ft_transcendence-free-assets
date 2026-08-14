
import ColoredButton from "../components/buttons/ColoredButton";
import { ButtonColor } from "../constants/Colors";


export default function Test() {
  return (
    <div className="h-4">
      <ColoredButton color={ButtonColor.Red} text="Enter"/>
      <ColoredButton color={ButtonColor.Black} text="Enter"/>
      <ColoredButton color={ButtonColor.Blue} text="Enter"/>
      <ColoredButton color={ButtonColor.Green} text="Enter"/>
      <ColoredButton color={ButtonColor.Purple} text="Enter"/>
    </div>
  );
}