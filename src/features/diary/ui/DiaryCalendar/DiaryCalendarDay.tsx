import { StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import { DayState } from 'react-native-calendars/src/types';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { DiaryEmotionImage } from '../DiaryEmotionImage';

interface Props {
  date?: string;
  state?: DayState;
  emotion?: number | null;
  onDateSelect?: (date: string) => void;
}

export function DiaryCalendarDay({ date, state, emotion = null, onDateSelect }: Props) {
  const colors = useThemeColor();
  const styles = DayStyles({ colors });

  const formattedDate = dayjs(date).format('D');

  return (
    <View style={styles.container}>
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
            style={[styles.emotionImage, state === 'disabled' && { opacity: 0.4 }]}
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
    </View>
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
    emotionImage: {
      width: 40,
      height: 40,
    },
    smallDayText: {
      position: 'absolute',
      top: 0,
      right: 0,
      fontSize: 8,
      lineHeight: 10,
    },
  });
