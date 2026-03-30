import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { EmotionImage } from '@shared/ui/Image';
import { ImgSunBasic } from '@assets/images';

const selectWeeklyEmotionText = (emotion?: number | null) => {
  if (emotion == null) return null;

  if (emotion <= 20) {
    return {
      bold: '마음이 무겁게',
      suffix: ' \n가라앉아 있어요',
    };
  }
  if (emotion <= 40) {
    return {
      bold: '지치고 고단한 마음',
      suffix: '이\n자주 나타나고 있어요',
    };
  }
  if (emotion <= 60) {
    return {
      bold: '잔잔하고 평온함',
      suffix: '\n을 유지하고 있어요',
    };
  }
  if (emotion <= 80) {
    return {
      bold: '긍정적이고 활기찬\n에너지가',
      suffix: ' 가득해요',
    };
  }
  if (emotion <= 100) {
    return {
      bold: '밝은 기운이 눈부시게',
      suffix: '\n느껴지고 있어요',
    };
  }

  return null;
};

const selectWeeklyEmotionColor = (emotion?: number | null) => {
  if (emotion == null) return null;

  if (emotion <= 20) {
    return '#A1B4BB33';
  }
  if (emotion <= 40) {
    return '#9AE4FF33';
  }
  if (emotion <= 60) {
    return '#FFF8CD33';
  }
  if (emotion <= 80) {
    return '#FFE13433';
  }
  if (emotion <= 100) {
    return '#FF3B3033';
  }

  return null;
};

interface Props {
  emotion?: number | null;
}

export function WeeklyEmotionCard({ emotion }: Props) {
  const colors = useThemeColor();
  const styles = CardStyles({ colors });

  const emotionText = selectWeeklyEmotionText(emotion);
  const emotionColor = selectWeeklyEmotionColor(emotion);

  return (
    <View style={[styles.container, emotionColor && { backgroundColor: emotionColor }]}>
      {emotion == null && (
        <>
          <MDText type="labelRegular" color={colors.text.brand}>
            {`이번 주, 내 감정은?\n`}
            <MDText type="labelSemiBold">{'기록하고 확인'}</MDText>
            {'해보세요'}
          </MDText>
          <Image style={{ width: 40, height: 40, alignSelf: 'flex-end' }} source={ImgSunBasic} />
        </>
      )}
      {emotion != null && emotionText && (
        <>
          <MDText type="labelRegular" color={colors.text.brand}>
            {`이번 주는\n`}
            <MDText type="labelSemiBold">{emotionText.bold}</MDText>
            {emotionText.suffix}
          </MDText>
          <EmotionImage style={{ alignSelf: 'flex-end' }} emotion={emotion} size={40} />
        </>
      )}
    </View>
  );
}

const CardStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      minWidth: 165,
      minHeight: 120,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
      backgroundColor: colors.fill.normal,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.line.normal,
      justifyContent: 'space-between',
    },
  });
