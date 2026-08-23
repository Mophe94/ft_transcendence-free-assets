export const Color = {
    SkyBlue: '#1cbbb3f2',
    SeaBlue: '#47aba9',
    SteelBlue: '#41919d',
    SlateBlue: '#4a6982',
    NightBlue:'#05011f',
    MintGreen: '#caffc8',
    ForestGreen: '#327c00',
    LushGreen: '#10901a',
    VibrantEmerald: '#15b122',
    PastelYellow: '#fff657',
    PastelRed: '#f65555',
    DarkGarnet: '#700e0e',
    DeepAmber: '#914103',
    TransDarkCrimson: '#840606',
    TransDarkBlood: '#670808',
    DeepMagenta: '#88186b',
    DarkPlum: '#6d1256',
    SaddleBrown: '#7f4508',
    LightGrey: '#e7e7e7',
    Grey: '#797979',
    DarkGrey: '#140a32f2',
    AnthraciteGrey: '#323441',
    Black: '#000000',
    White: '#ffffff',
    PearlWhite: '#e3e7ec',
    WarmEggshell: '#f2eadb',
}

export const ChatColor = {
  ORANGE: 'orangered',
  RED: 'red',
  MAROON: 'maroon',
  FUCHSIA: 'fuchsia',
  PURPLE: 'purple',
  GREEN: 'green',
  DARK_GREEN: 'darkgreen',
  DARK_TURQUOISE: 'darkturquoise',
  BLUE: 'blue',
  NAVY: 'navy',
  SIENNA: 'sienna',
  AQUA: 'aqua',
  TEAL: 'teal',
} as const;

export type ChatColor = typeof ChatColor[keyof typeof ChatColor];

export const ButtonColor = {
  Black: {
      name: 'Black',
      textColor: 'text-black',
      borderColor: `before:[-webkit-text-stroke:4px_var(--color-pearl-white)]`,
      bg_reg: `bg-anthracite-grey`,
      bg_pressed: `bg-anthracite-grey`,
  }, 
  Blue: {
      name: 'Blue',
      textColor: `text-steel-blue`,
      borderColor: `before:[-webkit-text-stroke:4px_var(--color-warm-eggshell)]`,
      bg_reg: `bg-steel-blue`,
      bg_pressed: `bg-slate-blue]`,
  }, 
  Red: {
      name: 'Red',
      textColor: `text-pastel-yellow`,
      borderColor: 'before:[-webkit-text-stroke:4px_maroon]',
      bg_reg: `bg-pastel-red`,
      bg_pressed: `bg-pastel-red`,
  },
  Green: {
      name: 'Green',
      textColor: `text-forest-green`,
      borderColor: `before:[-webkit-text-stroke:4px_var(--color-mint-green)]`,
      bg_reg: `bg-vibrant-emerald`,
      bg_pressed: `bg-lush-green`,
  },
  Purple: {
      name: 'Purple',
      textColor: `text-deep-magenta`,
      borderColor: `before:[-webkit-text-stroke:4px_var(--color-warm-eggshell)]`,
      bg_reg: `bg-deep-magenta`,
      bg_pressed: `bg-deep-magenta`,
  },
} as const;

export type ButtonColor = typeof ButtonColor[keyof typeof ButtonColor];

