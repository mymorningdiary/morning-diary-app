import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { MDText } from '@shared/ui/Text';
import { useThemeColor } from '@shared/lib/theme';
import { ImgOnboarding2 } from '@assets/images';

export function OnboardingSlide2() {
  const colors = useThemeColor();
  const styles = SlideStyles;

  return (
    <View style={styles.container}>
      <MDText type="titleSemiBold" color={colors.text.brand} align="center">
        {`아침일기를 통해\n`}
        <MDText type="titleSemiBold" color={colors.primary.normal}>
          {`'나'`}
        </MDText>
        {`를 더 알아보는 시간`}
      </MDText>

      <Image style={styles.image} source={ImgOnboarding2} contentFit="contain" />
    </View>
  );
}

const SlideStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  image: {
    width: 280,
    height: 300,
  },
});
