import { MDPressable, MDRow, MDText } from '@/components';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { useMemo } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  visible: boolean;
  title?: string;
  subtitle?: string;
  negativeButton?: {
    text: string;
    onPress: () => void;
  };
  positiveButton?: {
    text: string;
    onPress: () => void;
  };
  onClose?: () => void;
}

export default function MDDefaultModal({
  visible,
  title,
  subtitle,
  negativeButton,
  positiveButton,
  onClose,
}: Props) {
  const colors = useThemeColor();
  const styles = useMemo(() => ModalStyles({ colors }), [colors]);

  return (
    <Modal animationType="fade" visible={visible} transparent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.containerContent}>
          <View style={styles.containerTitle}>
            {title && (
              <MDText type="bodySemiBold" style={styles.title}>
                {title}
              </MDText>
            )}
            {subtitle && (
              <MDText type="bodyRegular" style={styles.title}>
                {subtitle}
              </MDText>
            )}
          </View>

          <MDRow style={styles.containerButton}>
            {negativeButton && (
              <MDPressable style={styles.button} onPress={negativeButton.onPress}>
                <MDText style={styles.negativeButtonText}>{negativeButton.text}</MDText>
              </MDPressable>
            )}
            {positiveButton && (
              <MDPressable style={styles.button} onPress={positiveButton.onPress}>
                <MDText style={styles.positiveButtonText}>{positiveButton.text}</MDText>
              </MDPressable>
            )}
          </MDRow>
        </View>
      </Pressable>
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
    },
    containerContent: {
      width: SCREEN_WIDTH * 0.8,
      backgroundColor: colors.background.normal,
      borderRadius: 24,
      padding: 24,
      gap: 12,
    },
    containerTitle: {
      gap: 16,
    },
    title: {
      color: colors.text.normal,
    },
    containerButton: {
      justifyContent: 'flex-end',
      gap: 2,
    },
    button: {
      padding: 12,
    },
    negativeButtonText: {
      color: colors.text.alternative,
    },
    positiveButtonText: {
      color: colors.primary.normal,
    },
  });
