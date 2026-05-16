import { IconWeeklyReport } from '@assets/icons';
import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  title: string;
  reportId: number;
}

export function DiaryWeeklyReportItem({ style, title, reportId }: Props) {
  const colors = useThemeColor();

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <LinearGradient
        colors={['#FF8733', '#FFBA8A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientBorder, style]}>
        <Pressable
          style={[styles.container, { backgroundColor: colors.fill.normal }]}
          onPress={() => router.push(`/report/${reportId}`)}>
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
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientBorder: {
    borderRadius: 16,
    padding: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
});
