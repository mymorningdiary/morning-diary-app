import { Modal, StyleSheet, useWindowDimensions, View } from 'react-native';

import { WEEKLY_REPORT_DIARY_GOAL } from '@entities/report';
import { useThemeColor } from '@shared/lib/theme';
import { MDButton } from '@shared/ui/Button';
import { MDText } from '@shared/ui/Text';

interface Props {
  visible?: boolean;
  onConfirm?: () => void;
}

export function WeeklyReportGoalModal({ visible = false, onConfirm }: Props) {
  const colors = useThemeColor();
  const { width } = useWindowDimensions();

  return (
    <Modal animationType="fade" visible={visible} transparent onRequestClose={onConfirm}>
      <View style={[styles.overlay, { backgroundColor: colors.fill.dim }]}>
        <View
          style={[
            styles.container,
            {
              width: Math.min(width - 32, 410),
              backgroundColor: colors.fill.normal,
            },
          ]}>
          <View style={styles.content}>
            <MDText type="titleSemiBold" align="center" color={colors.text.brand}>
              주간리포트 일기 {WEEKLY_REPORT_DIARY_GOAL}회 달성!
            </MDText>

            <View>
              <MDText type="labelRegular" color={colors.text.brand}>
                ✨ 이번주 리포트는 일요일에 열 수 있어요
              </MDText>
              <MDText type="labelRegular" color={colors.text.brand}>
                ✨ 열지 않으면 일요일 오후 8시에 자동 생성 돼요
              </MDText>
              <MDText type="caption1SemiBold" color={colors.primary.normal}>
                (자동 생성 후, 쓴 일기는 리포트에 포함되지 않아요)
              </MDText>
            </View>
          </View>

          <MDButton label="확인" size="large" onPress={onConfirm} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 24,
  },
  content: {
    gap: 16,
  },
});
