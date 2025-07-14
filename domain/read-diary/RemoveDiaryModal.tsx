import { MDPressable, MDRow, MDText } from '@/components';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { useMemo } from 'react';
import { Dimensions, Modal, StyleSheet, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  title: string;
  opened: boolean;
  closeModal: () => void;
  removeDiary: () => void;
}

export default function RemoveDiaryModal({ title, opened, closeModal, removeDiary }: Props) {
  const colors = useThemeColor();
  const styles = useMemo(() => ModalStyles({ colors }), [colors]);

  return (
    <Modal animationType="fade" visible={opened} transparent>
      <MDPressable style={styles.overlay} pressedOpacity={1} onPress={closeModal}>
        <View style={styles.containerModal}>
          <MDText type="bodyRegular" style={styles.title}>
            {'일기를 삭제할까요?'}
          </MDText>

          <MDRow style={styles.containerFooter}>
            <MDPressable style={styles.button} onPress={closeModal}>
              <MDText style={styles.textCancel}>{'취소'}</MDText>
            </MDPressable>
            <MDPressable style={styles.button} onPress={removeDiary}>
              <MDText style={styles.textRemove}>{'삭제'}</MDText>
            </MDPressable>
          </MDRow>
        </View>
      </MDPressable>
    </Modal>
  );
}

const ModalStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.fill.dim,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    containerModal: {
      width: SCREEN_WIDTH * 0.8,
      backgroundColor: colors.background.normal,
      borderRadius: 24,
      gap: 12,
      padding: 24,
    },
    title: {
      color: colors.text.normal,
    },
    containerFooter: {
      justifyContent: 'flex-end',
      gap: 2,
    },
    textCancel: {
      color: colors.text.alternative,
    },
    textRemove: {
      color: colors.primary.normal,
    },
    button: {
      padding: 12,
    },
  });
