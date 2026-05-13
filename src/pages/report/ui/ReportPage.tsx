import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useThemeColor } from '@shared/lib/theme';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';
import { ReportInsightSection } from './ReportInsightSection';
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

  const unconsciousInsights = [
    {
      title: '본질에 대한 완벽주의',
      content:
        '"단순해야 할까, 의미가 있어야 할까?"를 반복해서 묻는 모습에서, 적당히 타협하기보다 확실한 정체성을 만들고 싶어 하는 강한 책임감이 발견되었어요.',
    },
    {
      title: '통제력을 통한 안도감',
      content:
        '먹고 싶은 욕구를 참고 건강한 식재료를 구체적으로 나열하는 행위는, 현재 불확실한 상황에서 나의 몸만큼은 확실히 통제하고 싶어 하는 심리가 반영된 것일 수 있어요.',
    },
    {
      title: '졸음을 이겨내는 행동력',
      content:
        '모든 일기에 "졸리다"는 말이 빠지지 않지만, 결국 운동과 요가로 이어지는 흐름에서 피로감보다 성취감을 우선시하는 단단한 의지가 읽히고 있어요.',
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
        <ReportInsightSection style={styles.insightContent} insights={unconsciousInsights} />
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
  insightContent: {
    marginTop: 80,
  },
});
