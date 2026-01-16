import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { MDText } from '@shared/ui/MDText';
import { useThemeColor } from '@shared/lib/theme';
import { ImgOnboarding1 } from '@assets/images';

export function OnboardingSlide1() {
  const colors = useThemeColor();
  const styles = SlideStyles;

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={ImgOnboarding1} />
      <View style={styles.textContent}>
        <MDText type="titleSemiBold" color={colors.text.brand} align="center">
          {`'나'를 발견하는 `}
          <MDText type="titleSemiBold" color={colors.primary.normal}>
            {`아무 말`}
          </MDText>
          {`이나 쓰는 아침 일기`}
        </MDText>
        <MDText type="labelRegular" color={colors.text.alternative} align="center">
          {`기상 직후 45분 동안은 사람의 방어기제가\n활동하지 않는 유일한 시간이에요.\n\n아침일기를 쓰면 새로운 ‘나’를 발견할지도 몰라요.`}
        </MDText>
      </View>
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
    width: 160,
    height: 180,
  },
  textContent: {
    gap: 4,
  },
});
