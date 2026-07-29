import "./ShieldFrame.css"

import shield from '../assets/frame/Shield.png'
interface ShieldProps {
  imgSrc?: string;
  imgAlt?: string;
}

export default function ShieldFrame ({imgSrc, imgAlt}: ShieldProps) {
    return (
        <div className="shield-container">
            
            <img className="shield-content" src={imgSrc} alt={imgAlt} />
            <img className="shield-frame" src={shield} alt="shield frame"/>
        </div>
    )
}