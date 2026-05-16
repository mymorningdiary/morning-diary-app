import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import dayjs from 'dayjs';

import { useGetWeeklyReports } from '@entities/report';
import { parseNumberParam } from '@shared/lib/router';
import { useThemeColor } from '@shared/lib/theme';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';
import { ReportEmpathySection } from './ReportEmpathySection';
import { ReportInsightSection } from './ReportInsightSection';
import { ReportTopKeywordSection } from './ReportTopKeywordSection';
import { WeeklyCalendar } from './WeeklyCalendar';

export function ReportPage() {
  const colors = useThemeColor();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const weeklyReportId = parseNumberParam(id);
  const { weeklyReport, isPending, isError } = useGetWeeklyReports(weeklyReportId);
  const weeklyReportDateRange = weeklyReport
    ? `${dayjs(weeklyReport.weekStartDate).format('YYYY.MM.DD')} - ${dayjs(
        weeklyReport.weekEndDate,
      ).format('YYYY.MM.DD')}`
    : '';

  const handleDayPress = (date?: string) => {
    const diary = weeklyReport?.writtenDates.find((d) => d.writtenDate === date);
    if (!diary) return;

    router.push({
      pathname: '/diary-read',
      params: {
        date,
        diaryId: diary.diaryId,
      },
    });
  };

  if (!weeklyReportId) {
    return <Redirect href="/(app)/(main)" />;
  }

  return (
    <MDPage style={styles.container}>
      <MDAppBar title="주간리포트" onBack={() => router.back()} />

      {isPending ? (
        <View style={styles.centerContent}>
          <ActivityIndicator color={colors.primary.normal} />
        </View>
      ) : isError || !weeklyReport ? (
        <View style={styles.centerContent}>
          <MDText type="bodyRegular" color={colors.text.alternative}>
            주간리포트를 불러오지 못했어요
          </MDText>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          bounces={false}>
          <View>
            <View style={styles.headerContent}>
              <MDText type="caption1Regular" color={colors.text.alternative}>
                {weeklyReportDateRange}
              </MDText>
              {!!weeklyReport.title && (
                <MDText type="heading1SemiBold" color={colors.text.brand}>
                  {weeklyReport.title}
                </MDText>
              )}

              <WeeklyCalendar
                startDate={weeklyReport.weekStartDate}
                endDate={weeklyReport.weekEndDate}
                diaries={weeklyReport.writtenDates}
                onDayPress={handleDayPress}
              />

              {!!weeklyReport.summary && (
                <MDText type="bodyRegular" color={colors.text.alternative}>
                  {`"${weeklyReport.summary}"`}
                </MDText>
              )}
            </View>
          </View>

          <ReportTopKeywordSection
            style={styles.topKeywordContent}
            topKeywords={weeklyReport.topKeywords}
          />
          <ReportInsightSection
            style={styles.insightContent}
            insights={weeklyReport.unconsciousInsights}
          />
          <ReportEmpathySection
            style={styles.empathySentenceContent}
            sentences={weeklyReport.empathySentences}
          />
        </ScrollView>
      )}
    </MDPage>
  );
}

const styles = StyleSheet.create({
  container: {},
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 60,
  },
  headerContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  topKeywordContent: {
    marginTop: 40,
  },
  insightContent: {
    marginTop: 40,
  },
  empathySentenceContent: {
    marginTop: 40,
  },
});
