import { Pressable, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { IconChevronLeft, IconChevronRight } from '@assets/icons';

interface Props {
  month?: string;
  onMonthChange?: (date: string) => void;
}

export function DiaryCalendarHeader({
  month = dayjs().format('YYYY-MM-DD'),
  onMonthChange,
}: Props) {
  const colors = useThemeColor();
  const styles = Styles({ colors });

  const formattedDate = dayjs(month).format('YYYY년 MM월');

  const handlePrevMonthChange = () => {
    const prev = dayjs(month).add(-1, 'month').startOf('month').format('YYYY-MM-DD');
    onMonthChange?.(prev);
  };

  const handleNextMonthChange = () => {
    const next = dayjs(month).add(1, 'month').startOf('month').format('YYYY-MM-DD');
    onMonthChange?.(next);
  };

  return (
    <View style={styles.container}>
      <Pressable hitSlop={24} onPress={handlePrevMonthChange}>
        <IconChevronLeft width={16} height={16} color={colors.icon.normal} />
      </Pressable>

      <MDText type="heading2SemiBold" color={colors.text.brand}>
        {formattedDate}
      </MDText>

      <Pressable hitSlop={24} onPress={handleNextMonthChange}>
        <IconChevronRight width={16} height={16} color={colors.icon.normal} />
      </Pressable>
    </View>
  );
}

const Styles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingTop: 16,
      paddingBottom: 24,
      alignItems: 'center',
      gap: 12,
    },
  });
