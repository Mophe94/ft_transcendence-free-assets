

interface HeadingProps {
    text: string;
    size: 'sm'|'m'|'l';
    className?: string;
}

export default function Heading ({text, size='l', className=''}: HeadingProps) {
  const textSize = () => {
    switch(size){
      case 'sm':
        return "font-rocker text-[clamp(2.2rem,4vw,5rem)] text-[#840606b0] [-webkit-text-stroke:2px_black] text-center";
      case 'm':
        return "font-rocker font-normal text-[rgba(103,8,8,0.691)] [-webkit-text-stroke:2px_black] text-[clamp(0.7rem,10vw,8rem)] my-[25px] min-w-[1024px]:text-[clamp(6.4rem, 7vw, 8rem)]";
       case 'l':
        return "font-rocker text-[clamp(0.8rem,15vw,7rem)] text-[rgb(112,14,14)] [-webkit-text-stroke:3px_black] text-center min-w-[1024px]:text-[clamp(7rem, 9vw, 10rem)]";
    }
  }
  return (
    <div className={`${textSize()} text-center ${className}`}>
      {text}
    </div>
  )
}