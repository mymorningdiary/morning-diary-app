import { useColorScheme } from 'react-native';

import { MDColors } from '@/types/types';
import { Colors } from '@/constants/colors';

// FIXME 고도화
export function useThemeColor(): MDColors {
  const theme = useColorScheme() ?? 'light';

  return Colors[theme];
}
