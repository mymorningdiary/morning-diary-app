import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import dayjs from 'dayjs';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { EmotionImage } from '@shared/ui/Image';

interface Props {
  style?: StyleProp<ViewStyle>;
  title?: string | null;
  content?: string;
  date?: string;
  emotion?: number | null;
  titleLines?: number;
}

export function DiaryPreviewCard({ style, title, content, date, emotion, titleLines }: Props) {
  const colors = useThemeColor();
  const styles = CardStyles({ colors });

  const formattedDate = date ? dayjs(date).locale('ko').format('D (dd)') : '';

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContent}>
        {emotion != null && <EmotionImage emotion={emotion} size={32} />}
        {formattedDate && (
          <MDText
            style={{ fontSize: 11, marginTop: emotion != null ? -4 : 0 }}
            type="caption1Regular"
            color={colors.text.alternative}>
            {formattedDate}
          </MDText>
        )}
      </View>

      <View style={styles.textContent}>
        {title && (
          <MDText type="bodySemiBold" color={colors.primary.normal} numberOfLines={titleLines}>
            {title}
          </MDText>
        )}
        {content && (
          <MDText
            type="labelRegular"
            color={colors.text.brand}
            numberOfLines={1}
            ellipsizeMode="tail">
            {content}
          </MDText>
        )}
      </View>
    </View>
  );
}

const CardStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.fill.normal,
      borderColor: colors.line.normal,
      borderWidth: 1,
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 8,
    },
    leftContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContent: {
      flexShrink: 1,
      justifyContent: 'center',
      gap: 2,
    },
  });
