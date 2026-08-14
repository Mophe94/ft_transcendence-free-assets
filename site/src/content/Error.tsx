import errorGif from '../assets/others/DinoCrying.gif';
import RegularBG from '../background/RegularBg';

export interface ErrorDisplayProps {
  code: number;
  msg?: string;
}

export default function ErrorDisplay({ msg = 'Page not found', code }: ErrorDisplayProps) {
  return (
    <RegularBG>
      <div className="flex flex-col items-center">
        <div className="font-rocker text-[clamp(56px,15vw,128px)] text-center [-webkit-text-stroke:3px_black] text-[darkred]">
          Error {code}
        </div>
        <div className="font-ubuntu text-[clamp(16px,5vw,28px)] text-center">
          {msg}
        </div>
        <img
          src={errorGif}
          alt="error-image"
          className="h-[clamp(96px,20vw,480px)] w-[clamp(96px,20vw,480px)] aspect-square min-[720px]:self-start"
        />
      </div>
    </RegularBG>
  );
}