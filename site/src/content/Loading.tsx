import fortyTwo from '../assets/forty-two.png';
import LoadingImg from '../assets/loading/loading.gif';
import SpecialBG from '../background/SpecialBg';

const loadStyles = {
  '--img42': `url(${fortyTwo})`,
} as React.CSSProperties;

export function Loading() {
  return (
    <SpecialBG>
      <div className='flex flex-col items-center justify-center'>
        <div className="w-[min(30vw,400px)]" style={loadStyles}>
          <img
            src={LoadingImg}
            alt="Loading"
            className="
            w-full rounded-[600px]
            bg-vibrant-cobalt bg-[radial-gradient(circle,rgba(15,52,90,0.3)_30%,rgba(0,0,0,0.8)_100%),var(--img42)]
            bg-cover bg-center bg-no-repeat
            shadow-[0px_0px_10px_rgb(0,0,0)] content-center"
          />
          <div
            className="
            text-center font-rocker
            text-[min(10vw,128px)] text-deep-sapphire
            [-webkit-text-stroke:3px_black]">
            <span className="text-center">Loading...</span>
          </div>
        </div>
      </div>
    </SpecialBG>
  );
}