import regFrame from '../assets/frame/picture_frame.png';
import redFrame from '../assets/frame/picture_frame_fire.png';
import blueFrame from '../assets/frame/picture_frame_water.png';
import greenFrame from '../assets/frame/picture_frame_tree.png';
import purpleFrame from '../assets/frame/picture_frame_purple.png';
import yellowFrame from '../assets/frame/picture_frame_yellow.png';
import blackFrame from '../assets/frame/picture_frame_black.png';
import toxicFrame from '../assets/frame/picture_frame_caca.png';
import spartanFrame from '../assets/frame/picture_frame_spartan.png';
import athenianFrame from '../assets/frame/picture_frame_athenian.png';
import trojanFrame from '../assets/frame/picture_frame_trojan.png';

interface PicFrameProps {
  imgSrc: string;
  imgAlt?: string;
  color?: string;
}

// Optionnel : Un dictionnaire pour simplifier le switch
const framesMap: Record<string, string> = {
  red: redFrame,
  blue: blueFrame,
  green: greenFrame,
  purple: purpleFrame,
  yellow: yellowFrame,
  black: blackFrame,
  toxic: toxicFrame,
  spartan: spartanFrame,
  athenian: athenianFrame,
  trojan: trojanFrame,
};

export default function ImgFrame({ imgSrc, imgAlt, color = 'none' }: PicFrameProps) {
  const frame = framesMap[color] || regFrame;

  return (
    <div className="relative inline-block w-full aspect-232/238">
      <img
        className="
          absolute top-[5.5%] left-[5.2%]
          w-[89.6%] h-[89.5%]
          object-cover z-10 pointer-events-none
        "
        src={imgSrc}
        alt={imgAlt}
      />
      <img
        className="block w-full h-full absolute inset-0 z-20"
        src={frame}
        alt="picture frame"
      />
    </div>
  );
}