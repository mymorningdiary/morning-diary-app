import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ImgSunTwitch } from '@assets/images';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDText, SpeechBubble } from '@shared/ui/Text';
import { useThemeColor } from '@shared/lib/theme';

export function ResetPasswordCompletePage() {
  const colors = useThemeColor();
  const styles = PageStyles;

  return (
    <MDPage style={styles.container}>
      <View style={styles.sunContent}>
        <SpeechBubble text={'다시는 잊지 않겠다!'} align="center" />
        <Image style={{ width: 120, height: 120 }} contentFit="contain" source={ImgSunTwitch} />
        <MDText style={{ marginTop: 20 }} type="labelRegular" color={colors.text.alternative}>
          비밀번호를 변경했어요
        </MDText>
      </View>
      <MDButton
        style={{ marginHorizontal: 16 }}
        label="로그인 하러 가기"
        onPress={() => router.back()}
      />
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
  },
});
