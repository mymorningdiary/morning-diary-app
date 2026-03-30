import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import dayjs from 'dayjs';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { ImgEmotion1, ImgEmotion2, ImgEmotion3, ImgEmotion4, ImgEmotion5 } from '@assets/images';
import { DayState } from 'react-native-calendars/src/types';

const selectEmotionImage = (emotion: number) => {
  if (emotion <= 20) {
    return ImgEmotion1;
  }
  if (emotion <= 40) {
    return ImgEmotion2;
  }
  if (emotion <= 60) {
    return ImgEmotion3;
  }
  if (emotion <= 80) {
    return ImgEmotion4;
  }
  if (emotion <= 100) {
    return ImgEmotion5;
  }
};

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
          <Image
            style={[styles.emotionImage, state === 'disabled' && { opacity: 0.4 }]}
            source={selectEmotionImage(emotion)}
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
