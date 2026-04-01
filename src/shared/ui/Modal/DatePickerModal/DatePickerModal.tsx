import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDButton } from '@shared/ui/Button';
import { MDText } from '@shared/ui/Text';
import { WheelPicker } from './WheelPicker';

const PICKER_ITEM_HEIGHT = 48;
const PICKER_VISIBLE_COUNT = 5;
const PICKER_HEIGHT = PICKER_ITEM_HEIGHT * PICKER_VISIBLE_COUNT;

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

  const parsedDate = dayjs(date);
  const parsedYear = parsedDate.year();
  const parsedMonth = parsedDate.month() + 1;
  const minYear = parsedYear - 100;
  const maxYear = parsedYear + 10;
  const initialYear = Math.min(Math.max(parsedYear, minYear), maxYear);

  const [currentDate, setCurrentDate] = useState<YearMonth>({
    year: initialYear,
    month: parsedMonth,
  });

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, index) => minYear + index);
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
      if (prev.year === initialYear && prev.month === parsedMonth) {
        return prev;
      }

      return {
        year: initialYear,
        month: parsedMonth,
      };
    });
  }, [visible, initialYear, parsedMonth]);

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.container}>
          <MDText type="titleSemiBold" align="center">
            {`${currentDate.year}년 ${currentDate.month}월`}
          </MDText>

          <View style={styles.wheelContent}>
            <View
              pointerEvents="none"
              style={[
                styles.selectionOverlay,
                {
                  top: (PICKER_HEIGHT - PICKER_ITEM_HEIGHT) / 2,
                  height: PICKER_ITEM_HEIGHT,
                },
              ]}
            />
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
      width: Math.min(width - 32, 360),
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
      position: 'relative',
      flexDirection: 'row',
      gap: 6,
    },
    selectionOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      borderRadius: 14,
      borderWidth: 1,
      backgroundColor: colors.fill.alternative,
      borderColor: colors.line.normal,
    },
    buttonContent: {
      flexDirection: 'row',
      gap: 12,
    },
    button: {
      flex: 1,
    },
  });
