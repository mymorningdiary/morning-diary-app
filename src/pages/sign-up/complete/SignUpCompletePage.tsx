import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';

import { ImgSunBasic } from '@assets/images';
import { useThemeColor } from '@shared/lib/theme';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDText, SpeechBubble } from '@shared/ui/Text';

export function SignUpCompletePage() {
  const colors = useThemeColor();
  const styles = PageStyles;

  const { isExistUser } = useLocalSearchParams<{ isExistUser: 'true' | 'false' }>();

  const handleSignUpComplete = () => {
    router.replace(isExistUser === 'true' ? '/(app)' : '/(app)/alarm-permission');
  };

  return (
    <MDPage style={styles.container}>
      <View style={styles.sunContent}>
        <SpeechBubble text={`반가워요!\n저는 햇님이에요`} align="center" />
        <Image style={{ width: 120, height: 120 }} contentFit="contain" source={ImgSunBasic} />
        <MDText style={{ marginTop: 20 }} type="labelRegular" color={colors.text.alternative}>
          첫 아침일기를 쓰러 가볼까요?
        </MDText>
      </View>
      <MDButton
        style={{ marginHorizontal: 16 }}
        label="아침일기 쓰러 가기"
        onPress={handleSignUpComplete}
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
