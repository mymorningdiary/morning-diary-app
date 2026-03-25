import { StyleSheet, View } from 'react-native';

import { useThemeColor } from '@shared/lib/theme';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDText, SpeechSun } from '@shared/ui/Text';
import { router, useLocalSearchParams } from 'expo-router';
import { SelectTimeButton } from './SelectTimeButton';

export function NotificationPage() {
  const colors = useThemeColor();
  const styles = PageStyles;

  const { isExistUser } = useLocalSearchParams<{ isExistUser?: 'true' | 'false' }>();

  console.log('isExistUser:', isExistUser);

  return (
    <MDPage style={styles.container}>
      <MDAppBar
        title="알림"
        onBack={isExistUser != 'false' ? () => router.back() : undefined}
        onClose={isExistUser == 'false' ? () => router.replace('/(app)') : undefined}
      />
      <View style={styles.sunContent}>
        <SpeechSun text="햇님이가 알림을 보내드릴게요!" />

        <View>
          <MDText type="titleSemiBold" align="center">
            알림 받을 시간을 정해주세요
          </MDText>
          <MDText type="labelRegular" color={colors.text.alternative} align="center">
            나와의 약속을 만들어봐요
          </MDText>
        </View>

        <SelectTimeButton style={{ marginHorizontal: 16 }} />
      </View>

      <MDButton style={styles.button} label="완료" />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  sunContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  button: {
    marginHorizontal: 16,
  },
});
