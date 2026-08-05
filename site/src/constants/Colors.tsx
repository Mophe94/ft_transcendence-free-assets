export const Color ={
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

export type Color = typeof Color[keyof typeof Color];

export const ButtonColor = {
  Red: 'Red',
  Green: 'Green',
  Blue: 'Blue',
  Black: 'Black',
  Yellow: 'Yellow',
} as const;

export type ButtonColor = typeof ButtonColor[keyof typeof ButtonColor];