import GenericButton from "../components/buttons/GenericButtton";
import GenericButton2 from "../components/buttons/ColoredButton";
import { ButtonColor } from "../constants/Colors";

export default function Test() {
  return (
    <div className="h-4">
      <GenericButton2 color={ButtonColor.Red} text="Enter"/>
      <GenericButton2 color={ButtonColor.Black} text="Enter"/>
      <GenericButton2 color={ButtonColor.Blue} text="Enter"/>
      <GenericButton2 color={ButtonColor.Green} text="Enter"/>
      <GenericButton2 color={ButtonColor.Purple} text="Enter"/>
    </div>
  );
}