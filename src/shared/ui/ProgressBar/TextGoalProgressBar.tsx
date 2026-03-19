import { ImgSunSmall } from '@assets/images';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText, SpeechBubble } from '@shared/ui/Text';
import { Image } from 'expo-image';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const THUMB_MAX_PERCENT = 94;

interface Props {
  style?: StyleProp<ViewStyle>;
  progress: number;
  label?: string;
}

export function TextGoalProgressBar({ style, progress, label }: Props) {
  const colors = useThemeColor();
  const styles = ProgressBarStyles({ colors });

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.chip}>
          <MDText type="caption2Regular" color={colors.primary.normal}>
            {label}
          </MDText>
        </View>
      )}

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />

        <View style={[styles.thumb, { left: `${(progress / 100) * THUMB_MAX_PERCENT}%` }]}>
          <SpeechBubble
            style={[styles.thumbSpeechBubble, { minWidth: 40 + progress * 0.02 }]} // 0 -> 40, 100 -> 42
            text={`${progress}%`}
            variant="small"
          />
          <Image style={styles.thumbImage} source={ImgSunSmall} />
        </View>
      </View>
    </View>
  );
}

const ProgressBarStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 12,
      gap: 16,
    },
    chip: {
      alignSelf: 'center',
      backgroundColor: colors.primary.faint,
      color: colors.primary.normal,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 16,
    },
    track: {
      height: 12,
      borderRadius: 12,
      backgroundColor: colors.fill.alternative,
    },
    fill: {
      height: '100%',
      backgroundColor: colors.primary.light,
      borderTopStartRadius: 12,
      borderBottomStartRadius: 12,
    },
    thumb: {
      position: 'absolute',
      alignItems: 'center',
      top: 0,
      transform: [{ translateX: -6 }, { translateY: -12 }],
    },
    thumbImage: {
      width: 36,
      height: 36,
    },
    thumbSpeechBubble: {
      position: 'absolute',
      top: -24, // image 와 간격 3px
    },
  });
