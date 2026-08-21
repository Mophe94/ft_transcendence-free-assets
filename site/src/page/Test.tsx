import RegularBG from "../background/RegularBg";
import { LeftArrowButton } from "../components/buttons/ArrowButtons";
import ColoredButton from "../components/buttons/ColoredButton";

import Heading from "../components/heading/Heading";
import ImgFrame from "../components/ImgFrame";
import Aswd from "../components/keyboard/Aswd";
import LetterKey from "../components/keyboard/LetterKey";

import ShieldFrame from "../components/ShieldFrame";

import { ButtonColor } from "../constants/Colors";
import ErrorDisplay from "../content/Error";
import { Loading } from "../content/Loading";

export default function Test() {
  return (
    <RegularBG>
      <Heading size="l" text="Test"/>
      <div className="flex">
        <ColoredButton color={ButtonColor.Black} text='test' className="text-3xl"/>
        <ColoredButton color={ButtonColor.Blue} text='test'/>
        <ColoredButton color={ButtonColor.Red} text='test'/>
        <ColoredButton color={ButtonColor.Purple} text='test'/>
        <ColoredButton color={ButtonColor.Green} text='test'/>
      </div>
      <div className=" w-100">
      <ImgFrame imgSrc="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2.png"/>
      <ShieldFrame imgSrc="https://www.wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2.png"/>
      <Loading/>
      </div>
      <LeftArrowButton onClick={() => {}}/>
      <LetterKey kkey='g'/>
      <div className="w-50"><Aswd/></div>
      <ErrorDisplay code={500}></ErrorDisplay>
    </RegularBG>
  );
}