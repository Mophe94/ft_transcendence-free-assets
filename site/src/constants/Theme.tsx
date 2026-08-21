import sunTheme from '../assets/theme/sun_icon.png';
import moonTheme from '../assets/theme/moon_icon.png';
import darkBgImg from '../assets/background/dark_clouds.png'
import lightBgImg from '../assets/background/light_clouds.png'
import { Color } from './Colors';

export const Theme =  {
  light: {
    name: 'light',
    fontColor: 'text-black',
    bgColor: Color.SeaBlue,
    bgImg: lightBgImg,
    icon: sunTheme,
    dropMenuColor: `bg-sky-blue`,
    authLinkColor: `text-grey hover:bg-[#0000000f]`
  },
  dark: {
    name: 'dark',
    fontColor: `text-light-grey`,
    bgColor: Color.NightBlue,
    bgImg: darkBgImg,
    icon: moonTheme,
    dropMenuColor: `bg-dark-grey`,
    authLinkColor: `text-grey hover:bg-[#ffffff14]`
  }
} as const;

export type ThemeKey = keyof typeof Theme;
export type ThemeConfig = typeof Theme[ThemeKey];

export const DEFAULT_THEME_KEY: ThemeKey = 'light';