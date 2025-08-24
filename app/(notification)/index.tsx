import { MDPressable, MDRow, MDText } from '@/components';
import NotificationAppBar from '@/domain/notification/NotificationAppBar';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export default function NotificationScreen() {
  const colors = useThemeColor();
  const styles = useMemo(() => ScreenStyles({ colors }), [colors]);

  const { prevRoute } = useLocalSearchParams<{ prevRoute: string }>();

  const navigateBack = () => {
    router.back();
  };

  const onSkipButtonPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {prevRoute === 'onboarding' && (
        <MDRow style={styles.containerSkipAppBar}>
          <MDPressable style={styles.buttonSkip} onPress={onSkipButtonPress}>
            <MDText type="labelRegular" color={colors.text.alternative}>
              건너띄기
            </MDText>
          </MDPressable>
        </MDRow>
      )}
      {prevRoute === 'setting' && (
        <NotificationAppBar title="알림 시간" navigateBack={navigateBack} />
      )}
    </View>
  );
}

const ScreenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    containerSkipAppBar: {
      height: 48,
      justifyContent: 'flex-end',
    },
    buttonSkip: {
      height: '100%',
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
