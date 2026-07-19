import "./ImgFrame.css"

import picFrame from '../assets/frame/picture_frame_tree.png'
interface PicFrameProps {
  imgSrc?: string;
  imgAlt?: string;
}

export default function ImgFrame ({imgSrc, imgAlt}: PicFrameProps) {
    return (
        <div className="pic-frame-container">
            
            <img className="pic-frame-content" src={imgSrc} alt={imgAlt} />
            <img className="pic-frame" src={picFrame} alt="picture frame"/>
        </div>
    )
}