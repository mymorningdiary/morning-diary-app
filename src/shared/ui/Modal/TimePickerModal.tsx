import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDButton } from '@shared/ui/Button';
import { WheelPicker } from '../Picker/WheelPicker';

const PICKER_ITEM_HEIGHT = 48;
const PICKER_VISIBLE_COUNT = 3;
const PICKER_HEIGHT = PICKER_ITEM_HEIGHT * PICKER_VISIBLE_COUNT;

const DEFAULT_MINUTE_INTERVAL = 5;

const hours = Array.from({ length: 24 }, (_, index) => index);

const createMinutes = (minuteInterval: number) => {
  const interval = Math.min(Math.max(Math.floor(minuteInterval), 1), 60);
  const minutes: number[] = [];

  for (let minute = 0; minute < 60; minute += interval) {
    minutes.push(minute);
  }

  return minutes;
};

interface Time {
  hour: number;
  minute: number;
}

interface Props {
  visible: boolean;
  time: Time;
  minuteInterval?: number;
  onClose: () => void;
  onConfirm: (time: Time) => void;
}

export function TimePickerModal({
  visible,
  time,
  minuteInterval = DEFAULT_MINUTE_INTERVAL,
  onClose,
  onConfirm,
}: Props) {
  const colors = useThemeColor();
  const { width } = useWindowDimensions();
  const styles = ModalStyles({ colors, width });

  const minutes = createMinutes(minuteInterval);

  const [currentTime, setCurrentTime] = useState<Time>({
    hour: time.hour,
    minute: time.minute,
  });

  const handleHourChange = (hour: number) => {
    setCurrentTime((prev) => ({ ...prev, hour }));
  };

  const handleMinuteChange = (minute: number) => {
    setCurrentTime((prev) => ({ ...prev, minute }));
  };

  const handleConfirm = () => {
    onConfirm(currentTime);
  };

  useEffect(() => {
    if (!visible) return;

    setCurrentTime((prev) => {
      if (prev.hour === time.hour && prev.minute === time.minute) {
        return prev;
      }

      return {
        hour: time.hour,
        minute: time.minute,
      };
    });
  }, [visible, time]);

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.container}>
          <View style={styles.wheelContent}>
            <WheelPicker
              items={hours}
              value={currentTime.hour}
              suffix="시"
              onChange={handleHourChange}
              itemHeight={PICKER_ITEM_HEIGHT}
              pickerHeight={PICKER_HEIGHT}
            />
            <WheelPicker
              items={minutes}
              value={currentTime.minute}
              suffix="분"
              onChange={handleMinuteChange}
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
