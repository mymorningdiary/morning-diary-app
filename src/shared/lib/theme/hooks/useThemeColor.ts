import { useColorScheme } from 'react-native';

import { MDColors } from '../const/colors';
import { MDColorsType } from '../types/colors';

// FIXME 고도화
export function useThemeColor(): MDColorsType {
  const theme = useColorScheme() ?? 'light';

  return MDColors[theme];
}
