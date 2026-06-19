import videoSource from '../assets/video_banner_web.mp4';
import './Banner.css'

export function Banner () {
    return (
        <div className="banner-container">
            <img className="free_assets_banner" src="src/assets/free_assets.png" />
            <video className='video-banner' autoPlay loop muted playsInline>
                <source src={videoSource} type="video/mp4" />
            </video>
        </div>
    )
}