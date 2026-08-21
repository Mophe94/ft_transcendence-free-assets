import { Color } from "../../constants/Colors";


interface HeadingProps {
    text: string;
    size: 'sm'|'m'|'l';
    className?: string;
}

export default function Heading ({text, size='l', className=''}: HeadingProps) {


  const getTextClass = () => {
    switch(size){
      case 'sm':
        return "font-rocker text-[clamp(2.2rem,4vw,3rem)] [-webkit-text-stroke:2px_black] text-dark-plum";
      case 'm':
        return "font-rocker font-normal text-deep-amber [-webkit-text-stroke:2px_black] text-[clamp(0.7rem,10vw,3rem)] my-[25px] min-[1024px]:text-[clamp(3rem,5vw,4rem)]";
       case 'l':
        return "font-rocker text-dark-blood text-[clamp(0.8rem,15vw,7rem)] [-webkit-text-stroke:3px_black] min-[1024px]:text-[clamp(7rem,7vw,10rem)]";
    }
  }

  const textDecoration = getTextClass();
  return (
    <div
      className={`text-center ${textDecoration} ${className}`}
    >
      {text}
    </div>
  )
}