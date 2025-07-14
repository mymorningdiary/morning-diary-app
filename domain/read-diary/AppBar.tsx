import { MDPressable, MDRow, MDText } from '@/components';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

interface Props {
  title: string;
  onBackButtonPress: () => void;
  onUpdateButtonPress?: () => void;
  onRemoveButtonPress: () => void;
}

export default function AppBar({
  title,
  onBackButtonPress,
  onUpdateButtonPress,
  onRemoveButtonPress,
}: Props) {
  const colors = useThemeColor();
  const styles = useMemo(() => AppBarStyles({ colors }), [colors]);

  return (
    <MDRow style={styles.container}>
      <MDText type="titleSemiBold" style={styles.title}>
        {title}
      </MDText>

      <MDPressable style={styles.buttonBack} onPress={onBackButtonPress}>
        <Image source={require('@/assets/images/ic-chevron_left.png')} style={styles.icon} />
      </MDPressable>

      <MDRow style={styles.containerRight}>
        {onUpdateButtonPress && (
          <MDPressable style={styles.buttonUpdate} onPress={onUpdateButtonPress}>
            <Image source={require('@/assets/images/ic-pen.png')} style={styles.icon} />
          </MDPressable>
        )}

        <MDPressable style={styles.buttonRemove} onPress={onRemoveButtonPress}>
          <Image source={require('@/assets/images/ic-trash.png')} style={styles.icon} />
        </MDPressable>
      </MDRow>
    </MDRow>
  );
}

const AppBarStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      height: 48,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background.normal,
    },
    icon: {
      width: 24,
      height: 24,
    },
    title: {
      position: 'absolute',
      left: 0,
      right: 0,
      color: colors.text.brand,
      textAlign: 'center',
    },
    buttonBack: {
      height: '100%',
      justifyContent: 'center',
      paddingHorizontal: 12,
    },
    containerRight: {
      height: '100%',
    },
    buttonUpdate: {
      justifyContent: 'center',
      paddingStart: 12,
      paddingEnd: 8,
    },
    buttonRemove: {
      justifyContent: 'center',
      paddingStart: 8,
      paddingEnd: 12,
    },
  });
