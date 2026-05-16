import dayjs from 'dayjs';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { IconChevronLeft, IconChevronRight } from '@assets/icons';
import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { useState } from 'react';
import { DatePickerModal } from '../Modal';

interface Props {
  style?: StyleProp<ViewStyle>;
  date?: string;
  onDateChange?: (date: string) => void;
}

export function DatePicker({ style, date = dayjs().format('YYYY-MM-DD'), onDateChange }: Props) {
  const colors = useThemeColor();
  const styles = HeaderStyles;

  const [showDatePicker, setShowDatePicker] = useState(false);

  const formattedDate = dayjs(date).format('YYYY년 MM월');

  const handlePrevMonthChange = () => {
    const prev = dayjs(date).add(-1, 'month').startOf('month').format('YYYY-MM-DD');
    onDateChange?.(prev);
  };

  const handleNextMonthChange = () => {
    const next = dayjs(date).add(1, 'month').startOf('month').format('YYYY-MM-DD');
    onDateChange?.(next);
  };

  const handleDateConfirm = (date: string) => {
    setShowDatePicker(false);
    onDateChange?.(date);
  };

  return (
    <>
      <Pressable style={[styles.container, style]} onPress={() => setShowDatePicker(true)}>
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

      <DatePickerModal
        date={date}
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={handleDateConfirm}
      />
    </>
  );
}

const HeaderStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 4,
    alignItems: 'center',
    gap: 8,
  },
});
