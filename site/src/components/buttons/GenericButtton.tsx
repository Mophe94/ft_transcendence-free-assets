import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ButtonColor } from "../../constants/Colors";

interface ButtonProps {
  color?: ButtonColor;
  className?: string;
  func?: () => void;
  text: string;
  scale?: number;
}

const colorLoader = {
  Blue: () => import("../../assets/buttons/colored_buttons/blue"),
  Red: () => import("../../assets/buttons/colored_buttons/red"),
  Black: () => import("../../assets/buttons/colored_buttons/black"),
} as const;

export default function GenericButton({color=ButtonColor.Black, func = () => {}, text, className=''}: ButtonProps) {
  const [sprites, setSprites] = useState<Record<string, string> | null>(null);
  const [scale, setScale] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    colorLoader[color.name]().then((mod) => setSprites(mod.default));
  }, [color]);
  useLayoutEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      console.log(`scale-[${Math.floor(rect.height * 100 / 68)}]`)
      setScale(rect.height / 68);
    }
  }, [sprites])
  if (!sprites) return null;

  return (
    <div ref={divRef} className="h-full">
      <div
        onMouseDown={() => {setIsActive(true)}}
        onMouseUp={() => {setIsActive(false)}}
        onClick={func}
        className={`${isActive? 'hidden':''}
          grid grid-cols-[32px_1fr_32px] grid-rows-[22px_18px_28px]  w-min bg-black rounded-2xl`}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <div className="bg-no-repeat " style={{backgroundImage: `url(${sprites.reg_UL})`}}/>
        <div className="bg-[round_no-repeat]" style={{backgroundImage: `url(${sprites.reg_UM})`}}/>
        <div className="bg-no-repeat" style={{backgroundImage: `url(${sprites.reg_UR})`}}/>
        <div className="bg-[no-repeat_round]" style={{backgroundImage: `url(${sprites.reg_ML})`}}/>
        <div className="isolate font-im-fell font-bold" style={{backgroundImage: `url(${sprites.reg_MM})`}}>
          <div data-text={text} className="relative text-black text-nowrap
              before:content-[attr(data-text)] 
              before:absolute before:inset-0 before:-z-10 
              before:[-webkit-text-stroke:3px_white] 
              before:text-transparent">{text}</div>
        </div>
        <div className="bg-[no-repeat_round]" style={{backgroundImage: `url(${sprites.reg_MR})`}}/>
        <div className="bg-no-repeat " style={{backgroundImage: `url(${sprites.reg_BL})`}}/>
        <div className="bg-[round_no-repeat] " style={{backgroundImage: `url(${sprites.reg_BM})`}}/>
        <div className="bg-no-repeat " style={{backgroundImage: `url(${sprites.reg_BR})`}}/>
      </div>
      <div
        onMouseDown={() => {setIsActive(true)}}
        onMouseUp={() => {setIsActive(false)}}
        onMouseLeave={() => {setIsActive(false)}}
        className={`${!isActive? 'hidden':''}
          grid grid-cols-[32px_1fr_32px] grid-rows-[29px_18px_21px]`}>
        <div className="bg-no-repeat -mr-px -mb-px pixelated" style={{backgroundImage: `url(${sprites.pressed_UL})`}}/>
        <div className="bg-[round_no-repeat] -mr-px -mb-px" style={{backgroundImage: `url(${sprites.pressed_UM})`}}/>
        <div className="bg-no-repeat -mr-px -mb-px" style={{backgroundImage: `url(${sprites.pressed_UR})`}}/>
        <div className="bg-[no-repeat_round] -mr-px -mb-px" style={{backgroundImage: `url(${sprites.pressed_ML})`}}/>
        <div className="isolate bg-stretch -m-px font-im-fell font-bold" style={{backgroundImage: `url(${sprites.pressed_MM})`}}>
          <div
            data-text={text}
            className="relative text-black text-nowrap
              before:content-[attr(data-text)] 
              before:absolute before:inset-0 before:-z-10 
              before:[-webkit-text-stroke:3px_white] 
              before:text-transparent ">{text}</div>
        </div>
        <div className="bg-[no-repeat_round] -my-px " style={{backgroundImage: `url(${sprites.pressed_MR})`}}/>
        <div className="bg-no-repeat -mr-px -mb-px" style={{backgroundImage: `url(${sprites.pressed_BL})`}}/>
        <div className="bg-[round_no-repeat] -mx-px" style={{backgroundImage: `url(${sprites.pressed_BM})`}}/>
        <div className="bg-no-repeat -mr-px -mb-px" style={{backgroundImage: `url(${sprites.pressed_BR})`}}/>
      </div>
    </div>

  );
}