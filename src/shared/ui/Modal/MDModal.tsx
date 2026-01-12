import { useMemo } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';

import { MDText } from '../MDText';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  visible: boolean;
  title?: string;
  subtitle?: string;
  negative?: {
    text: string;
    onPress: () => void;
  };
  positive?: {
    text: string;
    onPress: () => void;
  };
  onClose?: () => void;
}

export function MDModal({ visible, title, subtitle, negative, positive, onClose }: Props) {
  const colors = useThemeColor();
  const styles = useMemo(() => ModalStyles({ colors }), [colors]);

  return (
    <Modal animationType="fade" visible={visible} transparent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.textContent}>
            {title && <MDText type="bodySemiBold">{title}</MDText>}
            {subtitle && <MDText type="bodyRegular">{subtitle}</MDText>}
          </View>

          <View style={styles.buttonContent}>
            {negative && (
              <Pressable style={styles.button} onPress={negative.onPress}>
                <MDText color={colors.text.alternative}>{negative.text}</MDText>
              </Pressable>
            )}
            {positive && (
              <Pressable style={styles.button} onPress={positive.onPress}>
                <MDText color={colors.primary.normal}>{positive.text}</MDText>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const ModalStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.fill.dim,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: SCREEN_WIDTH * 0.8,
      backgroundColor: colors.background.normal,
      borderRadius: 24,
      padding: 24,
      gap: 12,
    },
    textContent: {
      gap: 16,
    },
    buttonContent: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 2,
    },
    button: {
      padding: 12,
    },
  });
