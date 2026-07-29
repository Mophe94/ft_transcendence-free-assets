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

export type ColorType = typeof Color[keyof typeof Color];