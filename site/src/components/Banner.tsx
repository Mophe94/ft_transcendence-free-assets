import videoSource from '../assets/video_banner_web.mp4';

export function Banner() {
  return (
    <div className="
      relative w-full flex justify-center overflow-hidden box-border
      rounded-[20px] border-[3px] border-solid border-[rgb(121,121,121)]
      shadow-[0_0_10px_10px_rgba(255,255,255,0.5)]
    ">
      <img
        className="absolute top-0 right-0 w-[33%] z-10"
        src="src/assets/free_assets.png"
        alt="Free assets"
      />
      <video
        className="relative top-0 w-full object-[center_top]"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoSource} type="video/mp4" />
      </video>
    </div>
  );
}