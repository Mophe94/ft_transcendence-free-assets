import "./ImgFrame.css";

import regFrame from '../assets/frame/picture_frame.png';
import redFrame from '../assets/frame/picture_frame_fire.png';
import blueFrame from '../assets/frame/picture_frame_water.png';
import greenFrame from '../assets/frame/picture_frame_tree.png';
import purpleFrame from '../assets/frame/picture_frame_purple.png';
import yellowFrame from '../assets/frame/picture_frame_yellow.png';
import blackFrame from '../assets/frame/picture_frame_black.png';
import cacaFrame from '../assets/frame/picture_frame_caca.png';
import spartanFrame from '../assets/frame/picture_frame_spartan.png';
import athenianFrame from '../assets/frame/picture_frame_athenian.png';
import trojanFrame from '../assets/frame/picture_frame_trojan.png';

interface PicFrameProps {
  imgSrc: string;
  imgAlt?: string;
  color?:string
}

export default function ImgFrame ({imgSrc, imgAlt, color='none'}: PicFrameProps) {
  let frame = regFrame;
  switch(color) {
    case 'red':
      frame = redFrame;
      break;
    case 'blue':
      frame = blueFrame;
      break;
    case 'green':
      frame = greenFrame;
      break;
    case 'purple':
      frame = purpleFrame;
      break;
    case 'yellow':
      frame = yellowFrame;
      break;
    case 'black':
      frame = blackFrame;
      break;
    case 'caca':
      frame = cacaFrame;
      break;
    case 'spartan':
      frame = spartanFrame;
      break;
    case 'athenian':
      frame = athenianFrame;
      break;
    case 'trojan':
      frame = trojanFrame;
      break;
    }
    return (
        <div className="pic-frame-container">
            <img className="pic-frame-content" src={imgSrc} alt={imgAlt} />
            <img className="pic-frame" src={frame} alt="picture frame"/>
        </div>
    )
}