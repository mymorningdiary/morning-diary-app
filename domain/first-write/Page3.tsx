import { MDLargeSpeechBubble } from '@/components';
import { MDText } from '@/components/MDText';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Page3() {
  const colors = useThemeColor();
  const styles = useMemo(() => PageStyles({ colors }), [colors]);

  return (
    <View style={styles.container}>
      <View>
        <MDLargeSpeechBubble text="내일도 만나요!" />
        <Image source={require('@/assets/images/img-sun_blush-comfort.png')} style={styles.image} />
      </View>

      <View style={styles.containerText}>
        <MDText type="titleSemiBold" color={colors.text.brand}>
          축하드려요!
        </MDText>

        <MDText type="titleSemiBold" color={colors.text.brand}>
          <MDText type="titleSemiBold" color={colors.primary.normal}>
            아침일기 목표
          </MDText>
          정했어요.
        </MDText>

        <MDText
          style={styles.textCenter2}
          type="labelRegular"
          color={colors.text.alternative}
          align="center">
          {`목표에 부담을 갖지 않아도 돼요.\n중요한 건 '꾸준히 써보는 것' 그 자체에요.`}
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
      width: 120,
      height: 120,
    },
    containerText: {
      alignItems: 'center',
    },
    textCenter2: {
      marginTop: 4,
    },
  });
