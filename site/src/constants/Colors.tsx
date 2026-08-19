export const Color = {
    SeaBlue: '#47aba9',
    NightBlue:'#05011f',
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
      textColor: 'text-[#000000]',
      borderColor: 'before:[-webkit-text-stroke:4px_#e3e7ec]',
      bg_reg: 'bg-[#323441]',
      bg_pressed: 'bg-[#323441]',
  }, 
  Blue: {
      name: 'Blue',
      textColor: 'text-[#41919d]',
      borderColor: 'before:[-webkit-text-stroke:4px_#f2eadb]',
      bg_reg: 'bg-[#41919d]',
      bg_pressed: 'bg-[#4a6982]',
  }, 
  Red: {
      name: 'Red',
      textColor: 'text-[#fff657]',
      borderColor: 'before:[-webkit-text-stroke:4px_maroon]',
      bg_reg: 'bg-[#f65555]',
      bg_pressed: 'bg-[#f65555]',
  },
  Green: {
      name: 'Green',
      textColor: 'text-[#327c00]',
      borderColor: 'before:[-webkit-text-stroke:4px_#caffc8]',
      bg_reg: 'bg-[#15b122]',
      bg_pressed: 'bg-[#10901a]',
  },
  Purple: {
      name: 'Purple',
      textColor: 'text-[#88186b]',
      borderColor: 'before:[-webkit-text-stroke:4px_#f2eadb]',
      bg_reg: 'bg-[#88186b]',
      bg_pressed: 'bg-[#6d1256]',
  },
} as const;

export type ButtonColor = typeof ButtonColor[keyof typeof ButtonColor];

