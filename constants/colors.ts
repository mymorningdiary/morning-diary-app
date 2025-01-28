const ColorPalette = {
  black: '#000000',
  white: '#FFFFFF',
  kakao: '#FEE500',
  orange: {
    10: '#6B2C00',
    20: '#8C3A00',
    30: '#B54B00',
    40: '#E86000',
    50: '#FF6900',
    60: '#FF8733',
    70: '#FF9B54',
    80: '#FFBA8A',
    90: '#FFD1B0',
    95: '#FDE1CD',
    98: '#FBF1EB',
    99: '#FBF9F8',
  },
  brown: {
    10: '#221E1B',
    20: '#2D2824',
    30: '#3A332E',
    40: '#4B423B',
    50: '#524841',
    60: '#756D67',
    70: '#8B8480',
    80: '#AFABA8',
    90: '#C9C6C4',
    95: '#DAD6D4',
    98: '#EBE6E4',
    99: '#F1EEEC',
  },
} as const;

export const Colors = {
  light: {
    primary: {
      normal: ColorPalette.orange[50],
      light: ColorPalette.orange[70],
      softer: ColorPalette.orange[95],
      faint: ColorPalette.orange[98],
    },
    background: {
      normal: ColorPalette.orange[99],
    },
    text: {
      normal: ColorPalette.brown[10],
      brand: ColorPalette.brown[50],
      alternative: ColorPalette.brown[70],
      inversion: ColorPalette.white,
    },
    line: {
      normal: ColorPalette.brown[98],
      alternative: ColorPalette.brown[90],
    },
    fill: {
      normal: ColorPalette.white,
      brand: ColorPalette.brown[50],
      alternative: ColorPalette.brown[98],
    },
    icon: {
      normal: ColorPalette.brown[50],
      alternative: ColorPalette.brown[95],
      inversion: ColorPalette.white,
    },
    kakao: ColorPalette.kakao,
  },
  dark: {
    primary: {
      normal: ColorPalette.orange[50],
      light: ColorPalette.orange[70],
      softer: ColorPalette.orange[95],
      faint: ColorPalette.orange[98],
    },
    background: {
      normal: ColorPalette.orange[99],
    },
    text: {
      normal: ColorPalette.brown[10],
      strong: ColorPalette.brown[50],
      alternative: ColorPalette.brown[70],
      inversion: ColorPalette.white,
    },
    line: {
      normal: ColorPalette.brown[98],
      alternative: ColorPalette.brown[90],
    },
    fill: {
      normal: ColorPalette.white,
      brand: ColorPalette.brown[50],
      alternative: ColorPalette.brown[98],
    },
    icon: {
      normal: ColorPalette.brown[50],
      alternative: ColorPalette.brown[95],
      inversion: ColorPalette.white,
    },
    kakao: ColorPalette.kakao,
  },
};
