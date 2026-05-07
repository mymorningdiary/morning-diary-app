import { IconChevronRight, IconLight } from '@assets/icons';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  title: string;
  weeklyReportId: number;
}

export function DiaryWeeklyReportItem({ style, title }: Props) {
  const colors = useThemeColor();
  const styles = CardStyles({ colors });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconBox}>
        <IconLight width={20} height={20} color={colors.primary.normal} />
      </View>

      <View style={styles.textContent}>
        <MDText type="caption1Regular" color={colors.text.alternative}>
          주간 리포트
        </MDText>
        <MDText type="bodySemiBold" color={colors.text.brand} numberOfLines={2}>
          {title}
        </MDText>
      </View>

      <IconChevronRight width={20} height={20} color={colors.icon.alternative} />
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
      gap: 10,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary.faint,
    },
    textContent: {
      flex: 1,
      justifyContent: 'center',
      gap: 2,
    },
  });
