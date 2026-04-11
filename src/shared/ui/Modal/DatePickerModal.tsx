import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDButton } from '@shared/ui/Button';
import { WheelPicker } from '../Picker/WheelPicker';

const PICKER_ITEM_HEIGHT = 48;
const PICKER_VISIBLE_COUNT = 3;
const PICKER_HEIGHT = PICKER_ITEM_HEIGHT * PICKER_VISIBLE_COUNT;

const MIN_YEAR = 2025;

interface Props {
  visible: boolean;
  date: string;
  onClose: () => void;
  onConfirm: (date: string) => void;
}

interface YearMonth {
  year: number;
  month: number;
}

export function DatePickerModal({ visible, date, onClose, onConfirm }: Props) {
  const colors = useThemeColor();
  const { width } = useWindowDimensions();
  const styles = ModalStyles({ colors, width });

  const currentYear = dayjs(date).year();
  const maxYear = currentYear + 10;
  const currentMonth = dayjs(date).month() + 1;

  const [currentDate, setCurrentDate] = useState<YearMonth>({
    year: currentYear,
    month: currentMonth,
  });

  const years = Array.from({ length: maxYear - MIN_YEAR + 1 }, (_, index) => MIN_YEAR + index);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);

  const handleYearChange = (year: number) => {
    setCurrentDate((prev) => ({ ...prev, year }));
  };

  const handleMonthChange = (month: number) => {
    setCurrentDate((prev) => ({ ...prev, month }));
  };

  const handleConfirm = () => {
    onConfirm(dayjs(`${currentDate.year}-${currentDate.month}-01`).format('YYYY-MM-DD'));
  };

  useEffect(() => {
    if (!visible) return;

    setCurrentDate((prev) => {
      if (prev.year === currentYear && prev.month === currentMonth) {
        return prev;
      }

      return {
        year: currentYear,
        month: currentMonth,
      };
    });
  }, [visible, currentYear, currentMonth]);

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.container}>
          <View style={styles.wheelContent}>
            <WheelPicker
              items={years}
              value={currentDate.year}
              suffix="년"
              onChange={handleYearChange}
              itemHeight={PICKER_ITEM_HEIGHT}
              pickerHeight={PICKER_HEIGHT}
            />
            <WheelPicker
              items={months}
              value={currentDate.month}
              suffix="월"
              onChange={handleMonthChange}
              itemHeight={PICKER_ITEM_HEIGHT}
              pickerHeight={PICKER_HEIGHT}
            />
          </View>

          <View style={styles.buttonContent}>
            <MDButton
              label="취소"
              variant="outline"
              fullWidth={false}
              style={styles.button}
              onPress={onClose}
            />
            <MDButton
              label="완료"
              fullWidth={false}
              style={styles.button}
              onPress={handleConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const ModalStyles = ({ colors, width }: { colors: MDColorsType; width: number }) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.fill.dim,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    container: {
      width: Math.min(width - 80, 360),
      backgroundColor: colors.background.normal,
      borderRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 20,
      gap: 20,
    },
    headerContent: {
      gap: 8,
    },
    wheelContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 24,
    },
    buttonContent: {
      flexDirection: 'row',
      gap: 12,
    },
    button: {
      flex: 1,
    },
  });
