import { Pressable, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';

import { IconChevronLeft, IconChevronRight } from '@assets/icons';
import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';

interface Props {
  date?: string;
  onDateChange?: (date: string) => void;
  onPress?: () => void;
}

export function DiaryCalendarHeader({
  date = dayjs().format('YYYY-MM-DD'),
  onDateChange,
  onPress,
}: Props) {
  const colors = useThemeColor();
  const styles = HeaderStyles;

  const formattedDate = dayjs(date).format('YYYY년 MM월');

  const handlePrevMonthChange = () => {
    const prev = dayjs(date).add(-1, 'month').startOf('month').format('YYYY-MM-DD');
    onDateChange?.(prev);
  };

  const handleNextMonthChange = () => {
    const next = dayjs(date).add(1, 'month').startOf('month').format('YYYY-MM-DD');
    onDateChange?.(next);
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Pressable hitSlop={24} onPress={handlePrevMonthChange}>
        <IconChevronLeft width={16} height={16} color={colors.icon.normal} />
      </Pressable>

      <MDText type="titleSemiBold" color={colors.text.brand}>
        {formattedDate}
      </MDText>

      <Pressable hitSlop={24} onPress={handleNextMonthChange}>
        <IconChevronRight width={16} height={16} color={colors.icon.normal} />
      </Pressable>
    </Pressable>
  );
}

const HeaderStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 4,
    alignItems: 'center',
    gap: 12,
  },
});
