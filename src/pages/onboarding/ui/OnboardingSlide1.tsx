import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { MDText, SpeechBubble } from '@shared/ui/Text';
import { useThemeColor } from '@shared/lib/theme';
import { ImgBook } from '@assets/images';

export function OnboardingSlide1() {
  const colors = useThemeColor();
  const styles = SlideStyles;

  return (
    <View style={styles.container}>
      <View style={styles.imageContent}>
        <SpeechBubble text="의식의 흐름" />
        <Image style={styles.image} source={ImgBook} contentFit="contain" />
      </View>

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
  imageContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  image: {
    width: 160,
    height: 180,
  },
  textContent: {
    gap: 4,
  },
});
