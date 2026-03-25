import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';

interface Props {
  style?: StyleProp<ViewStyle>;
  time?: string;
  disabled?: boolean;
  onPress?: () => void;
}

export function SelectTimeButton({ style, time, disabled, onPress }: Props) {
  const colors = useThemeColor();
  const styles = ButtonStyles({ colors });

  return (
    <Pressable style={[styles.container, style]} disabled={disabled} onPress={onPress}>
      <MDText type="bodyRegular">알림 시간</MDText>
      {time && <MDText type="bodyRegular">{time}</MDText>}
    </Pressable>
  );
}

const ButtonStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      alignSelf: 'stretch',
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.primary.softer,
      borderRadius: 16,
      paddingHorizontal: 16,
    },
  });
