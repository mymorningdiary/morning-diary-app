import { IconWeeklyReport } from '@assets/icons';
import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { router } from 'expo-router';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  title: string;
  weeklyReportId: number;
}

export function DiaryWeeklyReportItem({ style, title, weeklyReportId }: Props) {
  const colors = useThemeColor();

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <Pressable
        style={[
          styles.container,
          { backgroundColor: colors.fill.normal, borderColor: colors.primary.normal },
          style,
        ]}
        onPress={() => router.push(`/report/${weeklyReportId}`)}>
        <IconWeeklyReport width={32} height={32} />

        <View style={styles.textContent}>
          <MDText type="caption1Regular" color={colors.text.alternative}>
            주간리포트
          </MDText>
          <MDText type="labelSemiBold" color={colors.text.brand} numberOfLines={2}>
            {title}
          </MDText>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',

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
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
});
