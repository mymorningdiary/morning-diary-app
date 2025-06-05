import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { MDText } from '../MDText';
import { MDView } from '../MDView';

export const AssistantModal = () => {
  const colors = useThemeColor();
  const styles = useMemo(() => ModalStyles({ colors }), [colors]);

  return (
    <MDView style={styles.container}>
      <Image style={styles.image} source={require('@/assets/images/img-sun-basic.png')} />
      <MDText style={styles.text} type="labelSemiBold" numberOfLines={2} ellipsizeMode="tail">
        오늘의 목표를 입력해주세요. 오늘의 목표를 입력해주세요. 오늘의 목표를 입력해주세요. 오늘의
        목표를 입력해주세요. 오늘의 목표를 입력해주세요.
      </MDText>
    </MDView>
  );
};

const ModalStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.fill.normal,
      borderRadius: 16,
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
      // iOS shadow
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      // Android shadow
      elevation: 3,
    },
    image: {
      width: 48,
      height: 48,
    },
    text: {
      flex: 1,
      flexShrink: 1,
      color: colors.text.brand,
    },
  });
