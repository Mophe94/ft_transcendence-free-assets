import { useState, useEffect } from 'react';
import { ButtonColor } from '../../constants/Colors';

interface ButtonProps {
  color?: ButtonColor;
  className?: string;
  func?: () => void;
  text: string;
  scale?: number;
}

const colorLoader = {
  LightBlue: () => import("../../assets/buttons/colored_buttons/light_blue"),
  Blue: () => import("../../assets/buttons/colored_buttons/blue"),
  Red: () => import("../../assets/buttons/colored_buttons/red"),
  Black: () => import("../../assets/buttons/colored_buttons/black"),
  Green: () => import("../../assets/buttons/colored_buttons/green"),
  Purple: () => import("../../assets/buttons/colored_buttons/purple"),
} as const;

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(min-width: 640px)').matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)');

    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, []);

  return isDesktop;
}

export default function ColoredButton({ color = ButtonColor.Black, func = () => {}, text, className = '' }: ButtonProps) {
  const [sprites, setSprites] = useState<Record<string, string> | null>(null);
  const [isActive, setIsActive] = useState(false);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    colorLoader[color.name]().then((mod) => setSprites(mod.default));
  }, [color]);

  if (!sprites) return null;

  const currentSheet = isDesktop
    ? (isActive ? sprites.pressed_m : sprites.reg_m)
    : (isActive ? sprites.pressed_s : sprites.reg_s);

  const slice = isDesktop
    ? (isActive ? '29 32 21 32 fill' : '22 32 28 32 fill')
    : (isActive ? '14 16 11 16 fill' : '11 16 14 16 fill');

  const borderWidth = isDesktop
    ? (isActive ? '29px 32px 21px 32px' : '22px 32px 28px 32px')
    : (isActive ? '14px 16px 11px 16px' : '11px 16px 14px 16px');

  return (
    <button
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      onClick={func}
      style={{
        borderImageSource: `url(${currentSheet})`,
        borderImageSlice: slice,
        borderWidth: borderWidth,
        borderStyle: 'solid',
        borderImageRepeat: 'round',
      }}
      className={`w-min h-full cursor-pointer isolate font-im-fell font-bold flex items-center justify-center pixelated`}
    >
      <div
        data-text={text}
        className={`
          relative ${color.textColor} self-center text-nowrap -m-1
          before:content-[attr(data-text)] 
          before:absolute before:inset-0 before:-z-10 
          ${color.borderColor} 
          before:text-transparent
          ${className}
          `}
      >
        {text}
      </div>
    </button>
  );
}