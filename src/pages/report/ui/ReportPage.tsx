import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useThemeColor } from '@shared/lib/theme';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';
import { ReportTopKeywordSection } from './ReportTopKeywordSection';
import { WeeklyCalendar } from './WeeklyCalendar';

// "weeklyReportId": 1,
//     "weekStartDate": "2025-05-05",
//     "weekEndDate": "2025-05-11",
//     "title": "이번주는 잔잔히 회복한 한 주 였어요.",
//     "summary": "이번 주는 새로운 일과에 적응하며 작은 변화들을 만들어간 한 주였어요.",
//     "topKeywords": [
//       {
//         "word": "봄",
//         "count": 4
//       }
//     ],
//     "unconsciousInsights": [
//       {
//         "title": "반복되는 자기검열",
//         "content": "이번 주 일기에서 자신을 평가하는 표현이 자주 등장했어요."
//       }
//     ],
//     "empathySentences": [
//       "이번 주 정말 고생 많으셨어요.",
//       "스스로를 돌보려는 마음이 느껴져요."
//     ],
//     "writtenDates": [
//       {
//         "diaryId": 123,
//         "writtenDate": "2026-05-04",
//         "emotionScore": 86
//       }
//     ]

export function ReportPage() {
  const colors = useThemeColor();
  const title = '이번주는 잔잔히 회복한 한 주 였어요.';
  const summary = '이번 주는 새로운 일과에 적응하며 작은 변화들을 만들어간 한 주였어요.';
  const startDate = '2026-05-11';
  const endDate = '2026-05-17';
  const diaries = [
    {
      diaryId: 1,
      writtenDate: '2026-05-11',
      emotionScore: 86,
    },
    {
      diaryId: 2,
      writtenDate: '2026-05-12',
      emotionScore: 40,
    },
    {
      diaryId: 3,
      writtenDate: '2026-05-13',
      emotionScore: 60,
    },
  ];

  const topKeywords = [
    {
      word: '아메리카노',
      count: 5,
    },
    {
      word: '학원',
      count: 4,
    },
    {
      word: '피그마',
      count: 3,
    },
    {
      word: '베이글',
      count: 2,
    },
    {
      word: '집',
      count: 1,
    },
  ];

  const handleDayPress = (date?: string) => {
    const diary = diaries.find((d) => d.writtenDate === date);
    if (!diary) return;

    router.push({
      pathname: '/diary-read',
      params: {
        date,
        diaryId: diary.diaryId,
      },
    });
  };

  return (
    <MDPage style={styles.container}>
      <MDAppBar title="주간 보고서" onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}>
        <View>
          <View style={styles.headerContent}>
            {!!title && (
              <MDText type="heading1SemiBold" color={colors.text.brand}>
                {title}
              </MDText>
            )}

            <WeeklyCalendar
              startDate={startDate}
              endDate={endDate}
              diaries={diaries}
              onDayPress={handleDayPress}
            />

            {!!summary && (
              <MDText type="bodyRegular" color={colors.text.alternative}>
                {`"${summary}"`}
              </MDText>
            )}
          </View>
        </View>

        <ReportTopKeywordSection style={styles.topKeywordContent} topKeywords={topKeywords} />
      </ScrollView>
    </MDPage>
  );
}

const styles = StyleSheet.create({
  container: {},
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
    marginTop: 80,
  },
});
