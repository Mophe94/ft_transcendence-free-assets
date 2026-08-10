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
  Black: {
      name: 'Black',
      textColor: 'text-[#FFFFFF]',
      borderColor: '[-webkit-text-stroke:2px_#111111]',
  }, 
  Blue: {
      name: 'Blue',
      textColor: '#FFFFFF',
      borderColor: '#AAAAAA',
  }, 
  Red: {
      name: 'Red',
      textColor: 'text-[#F1F310]',
      borderColor: '[-webkit-text-stroke:2px_#222222]',
      
  }, 
} as const;

export type ButtonColor = typeof ButtonColor[keyof typeof ButtonColor];

