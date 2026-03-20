import { StyleSheet, View } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { Image } from 'expo-image';

import { ImgSunCongrats } from '@assets/images';
import { MDText } from '@shared/ui/Text';

export function FirstDiarySlide1() {
  const colors = useThemeColor();
  const styles = SlideStyles({ colors });

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={ImgSunCongrats} contentFit="contain" />

      <View style={styles.textContent}>
        <MDText type="titleSemiBold" color={colors.text.brand}>
          <MDText type="titleSemiBold" color={colors.primary.normal}>
            첫 일기
          </MDText>
          를 작성했어요
        </MDText>

        <MDText type="labelRegular" color={colors.text.alternative} align="center">
          {`한 줄 한 줄 쓰다보면,\n마음 속깊은 생각을 만나게 될거에요`}
        </MDText>
      </View>
    </View>
  );
}

const SlideStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 40,
    },
    image: {
      width: 160,
      height: 160,
    },
    textContent: {
      gap: 12,
      alignItems: 'center',
    },
  });
