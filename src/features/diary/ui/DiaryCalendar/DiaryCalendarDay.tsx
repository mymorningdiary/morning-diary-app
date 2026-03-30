import { Pressable, StyleSheet, View } from 'react-native';
import { DayState } from 'react-native-calendars/src/types';
import dayjs from 'dayjs';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { DiaryEmotionImage } from '../DiaryEmotionImage';

interface Props {
  date?: string;
  state?: DayState;
  emotion?: number | null;
  onDayPress?: (date?: string) => void;
}

export function DiaryCalendarDay({ date, state, emotion = null, onDayPress }: Props) {
  const colors = useThemeColor();
  const styles = DayStyles({ colors });

  const formattedDate = dayjs(date).format('D');

  return (
    <Pressable style={styles.container} onPress={() => onDayPress?.(date)}>
      {emotion != null && (
        <View>
          <MDText
            type="caption1Regular"
            style={styles.smallDayText}
            color={
              state === 'disabled'
                ? colors.text.disabled
                : state === 'today'
                  ? colors.primary.normal
                  : colors.text.brand
            }>
            {formattedDate}
          </MDText>
          <DiaryEmotionImage
            style={state === 'disabled' && { opacity: 0.4 }}
            size={40}
            emotion={emotion}
          />
        </View>
      )}
      {emotion == null && (
        <MDText
          type="numberRegular"
          color={
            state === 'disabled'
              ? colors.text.disabled
              : state === 'today'
                ? colors.primary.normal
                : colors.text.brand
          }>
          {formattedDate}
        </MDText>
      )}
    </Pressable>
  );
}

const DayStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
    smallDayText: {
      position: 'absolute',
      top: 0,
      right: 0,
      fontSize: 8,
      lineHeight: 10,
    },
  });
