import { ButtonColor } from "../../constants/Colors";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const NATIVE_HEIGHT = 84;

interface ButtonProps {
  color: ButtonColor;
  className?: string;
  func: () => void;
  text: string;
}

const colorLoader = {
  Blue: () => import("../../assets/buttons/colored_buttons/blue"),
  Red: () => import("../../assets/buttons/colored_buttons/red"),
  Black: () => import("../../assets/buttons/colored_buttons/black"),
} as const;

export default function ColoredButton({ color = ButtonColor.Blue, func, text, className = "" }: ButtonProps) {
  const [sprites, setSprites] = useState<Record<string, string> | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [scale, setScale] = useState(1);
  const [nativeWidth, setNativeWidth] = useState(0);

  useEffect(() => {
    colorLoader[color.name]().then((module) => setSprites(module.default));
  }, [color]);

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.height / NATIVE_HEIGHT);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);


  useLayoutEffect(() => {
    if (!buttonRef.current) return;
    setNativeWidth(buttonRef.current.offsetWidth);
  }, [sprites, text]);

  const pixelated: React.CSSProperties = { imageRendering: "pixelated" };

  return (
    <div ref={wrapperRef} className={`relative ${className} flex  flex-row justify-center`} style={{ width: nativeWidth * scale || undefined }}>
      {sprites && (
        <button
          ref={buttonRef}
          onClick={func}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            willChange: "transform",
            backfaceVisibility: "hidden",
            height: "max-content",
          }}
          className="group inline-grid grid-cols-[32px_1fr_32px] grid-rows-[22px_1fr_28px] active:grid-rows-[29px_1fr_21px] select-none cursor-pointer gap-0"
        >
          <div className="bg-no-repeat group-active:hidden -mr-px -mb-px" style={{ backgroundImage: `url(${sprites.reg_UL})`, ...pixelated }} />
          <div className="bg-no-repeat hidden group-active:block -mr-px -mb-px" style={{ backgroundImage: `url(${sprites.pressed_UL})`, ...pixelated }} />
          <div className="bg-repeat-x group-active:hidden -mx-px -mb-px" style={{ backgroundImage: `url(${sprites.reg_UM})`, ...pixelated }} />
          <div className="bg-repeat-x hidden group-active:block -mx-px -mb-px" style={{ backgroundImage: `url(${sprites.pressed_UM})`, ...pixelated }} />
          <div className="bg-no-repeat group-active:hidden -ml-px -mb-px" style={{ backgroundImage: `url(${sprites.reg_UR})`, ...pixelated }} />
          <div className="bg-no-repeat hidden group-active:block -ml-px -mb-px" style={{ backgroundImage: `url(${sprites.pressed_UR})`, ...pixelated }} />

          <div className="bg-repeat-y group-active:hidden -mr-px -my-px" style={{ backgroundImage: `url(${sprites.reg_ML})`, ...pixelated }} />
          <div className="bg-repeat-y hidden group-active:block -mr-px -my-px" style={{ backgroundImage: `url(${sprites.pressed_ML})`, ...pixelated }} />

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 group-active:hidden bg-repeat -m-px" style={{ backgroundImage: `url(${sprites.reg_MM})`, ...pixelated }} />
            <div className="absolute inset-0 hidden group-active:block bg-repeat -m-px" style={{ backgroundImage: `url(${sprites.pressed_MM})`, ...pixelated }} />
            <span className={`-translate-y-1.25 leading-none font-agba whitespace-nowrap [text-shadow:0_0_4px_#000] ${color.textColor} -m-px text-3xl ${color.borderColor} mx-4`}>
              {text}
            </span>
          </div>

          <div className="bg-repeat-y group-active:hidden -ml-px -my-px" style={{ backgroundImage: `url(${sprites.reg_MR})`, ...pixelated }} />
          <div className="bg-repeat-y hidden group-active:block -ml-px -my-px" style={{ backgroundImage: `url(${sprites.pressed_MR})`, ...pixelated }} />

          <div className="bg-no-repeat group-active:hidden -mt-px -mr-px" style={{ backgroundImage: `url(${sprites.reg_BL})`, ...pixelated }} />
          <div className="bg-no-repeat hidden group-active:block -mt-px -mr-px" style={{ backgroundImage: `url(${sprites.pressed_BL})`, ...pixelated }} />
          <div className="bg-repeat-x group-active:hidden -mt-px -mx-px" style={{ backgroundImage: `url(${sprites.reg_BM})`, ...pixelated }} />
          <div className="bg-repeat-x hidden group-active:block -mt-px -mx-px" style={{ backgroundImage: `url(${sprites.pressed_BM})`, ...pixelated }} />
          <div className="bg-no-repeat group-active:hidden -mt-px -ml-px" style={{ backgroundImage: `url(${sprites.reg_BR})`, ...pixelated }} />
          <div className="bg-no-repeat hidden group-active:block -mt-px -ml-px" style={{ backgroundImage: `url(${sprites.pressed_BR})`, ...pixelated }} />
        </button>
      )}
    </div>
  );
}