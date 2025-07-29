import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';
import { MDRow } from '../MDRow';
import { MDText } from '../MDText';
import { useMemo } from 'react';

type WriteAppBarProps = {
  date: string;
  isCompleteButtonEnabled: boolean;
  onCompleteButtonPress: () => void;
  onBackButtonPress: () => void;
};

export default function WriteAppBar({
  date,
  isCompleteButtonEnabled,
  onCompleteButtonPress,
  onBackButtonPress,
}: WriteAppBarProps) {
  const colors = useThemeColor();
  const styles = useMemo(
    () => appBarStyles({ colors, isCompleteButtonEnabled }),
    [colors, isCompleteButtonEnabled],
  );

  return (
    <MDRow style={styles.container}>
      <Pressable onPress={onBackButtonPress}>
        <Image source={require('@/assets/images/ic-chevron_left.png')} style={styles.icon} />
      </Pressable>
      <MDText type="titleSemiBold" style={styles.title}>
        {date}
      </MDText>
      <Pressable onPress={onCompleteButtonPress}>
        <MDText type="labelRegular" style={styles.textComplete}>
          완료
        </MDText>
      </Pressable>
    </MDRow>
  );
}

const appBarStyles = ({
  colors,
  isCompleteButtonEnabled,
}: {
  colors: MDColors;
  isCompleteButtonEnabled: boolean;
}) =>
  StyleSheet.create({
    container: {
      height: 48,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background.normal,
    },
    icon: {
      width: 24,
      height: 24,
    },
    title: {
      color: colors.text.brand,
    },
    textComplete: {
      color: isCompleteButtonEnabled ? colors.text.brand : colors.text.alternative,
    },
  });

export const formatDateToAppBarTitle = ({
  year,
  month,
  day,
}: {
  year: number;
  month: number;
  day: number;
}): string => {
  const date = new Date(year, month - 1, day);
  const options: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  };
  const formattedDate = date.toLocaleDateString('ko-KR', options);

  return formattedDate.replace(/\./g, '').replace(/(\d+) (\d+) \((.+)\)/, '$1월 $2일 $3');
};
