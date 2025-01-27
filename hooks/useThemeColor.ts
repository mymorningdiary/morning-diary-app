import { useColorScheme } from 'react-native';

import { MDColors } from '@/types/types';
import { Colors } from '@/constants/colors';

export function useThemeColor(): MDColors {
  const theme = useColorScheme() ?? 'light';

  return Colors[theme];
}
