import { MDProgressBar, MDRow, MDText, MDView } from '@/components';
import { WriteAppBar } from '@/components/write';
import { useUser } from '@/contexts/UserContext';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

const WORD_CNT_PER_PAGE = 50;

export default function Write() {
  const colors = useThemeColor();
  const styles = screenStyles({ colors });

  const { year, month, day } = useLocalSearchParams();
  const appBarTitle = useMemo(() => {
    return formatDateToAppBarTitle({
      year: Number(year),
      month: Number(month),
      day: Number(day),
    });
  }, [year, month, day]);

  const { user } = useUser();
  const targetWordCnt = useMemo(() => {
    const goalPage = user?.goalPage ?? 1;
    return goalPage * WORD_CNT_PER_PAGE;
  }, [user?.goalPage]);

  const [text, setText] = useState<string>('');

  const progress = useMemo(() => {
    const currentWordCnt = text.length;
    const result = Math.floor((Math.min(currentWordCnt, targetWordCnt) / targetWordCnt) * 100);

    return result;
  }, [text, targetWordCnt]);

  return (
    <MDView style={styles.container}>
      <WriteAppBar
        date={appBarTitle}
        isCompleteButtonEnabled={progress >= 100}
        onCompleteButtonPress={() => {
          // 저장 로직
        }}
        onBackButtonPress={() => router.back()}
      />

      <MDRow style={styles.containerProgressBar}>
        <MDProgressBar progress={progress} />
        <MDText
          type="caption2Regular"
          style={styles.textGoalPage}>{`${user?.goalPage ?? 0}P`}</MDText>
      </MDRow>
    </MDView>
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    containerProgressBar: {
      paddingTop: 38,
      paddingBottom: 12,
      paddingEnd: 16,
      alignItems: 'center',
    },
    textGoalPage: {
      color: colors.text.brand,
    },
    page: {
      padding: 24,
      minHeight: 600,
    },
    textInput: {
      flex: 1,
    },
    pageNumber: {
      alignSelf: 'flex-end',
      color: colors.text.alternative,
    },
    pageDivider: {
      height: 8,
      backgroundColor: colors.fill.alternative,
    },
  });

const formatDateToAppBarTitle = ({
  year,
  month,
  day,
}: {
  year: number;
  month: number;
  day: number;
}): string => {
  const date = new Date(year, month - 1, day);
  const options: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  };
  const formattedDate = date.toLocaleDateString('ko-KR', options);

  return formattedDate.replace(/\./g, '').replace(/(\d+) (\d+) \((.+)\)/, '$1월 $2일 $3');
};
