import { MDText } from '@/components/MDText';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Page1() {
  const colors = useThemeColor();
  const styles = useMemo(() => PageStyles({ colors }), [colors]);

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/img-sun-congratulation.png')} style={styles.image} />

      <View style={styles.containerText}>
        <MDText type="titleSemiBold" color={colors.text.brand}>
          축하드려요!
        </MDText>

        <MDText type="titleSemiBold" color={colors.text.brand}>
          <MDText type="titleSemiBold" color={colors.primary.normal}>
            첫 일기
          </MDText>
          를 작성했어요.
        </MDText>

        <MDText
          style={styles.textCenter2}
          type="labelRegular"
          color={colors.text.alternative}
          align="center">
          {`아침일기는 방어기제가 풀린\n가장 솔직한 시간에 쓰는 일기에요.\n\n한 줄 한 줄 쓰다보면, 마음 속\n깊은 생각을 만나게 될거에요.`}
        </MDText>
      </View>
    </View>
  );
}

const PageStyles = ({ colors }: { colors: MDColors }) =>
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
    containerText: {
      alignItems: 'center',
    },
    textCenter2: {
      marginTop: 4,
    },
  });
