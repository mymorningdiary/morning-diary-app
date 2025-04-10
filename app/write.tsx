import { MDCol, MDRow, MDText, MDView } from '@/components';
import { WriteAppBar, WriteProgressBar } from '@/components/write';
import { useUser } from '@/contexts/UserContext';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

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

  const [pages, setPages] = useState<string[]>(['']);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const totalText = useMemo(() => pages.join(''), [pages]);

  const currentPageText = pages[currentPageIndex] || '';

  const handleTextChange = (text: string, pageIndex: number) => {
    const newPages = [...pages];
    newPages[pageIndex] = text;

    if (text.length >= WORD_CNT_PER_PAGE && pageIndex === pages.length - 1) {
      setPages([...newPages, '']);
      setTimeout(() => {
        setCurrentPageIndex(pageIndex + 1);
      }, 50);
    } else {
      setPages(newPages);
    }
  };

  useEffect(() => {
    if (inputRefs.current[currentPageIndex]) {
      inputRefs.current[currentPageIndex]?.focus();
    }
  }, [currentPageIndex]);

  const progress = useMemo(() => {
    const currentWordCnt = totalText.length;
    const result = Math.floor((Math.min(currentWordCnt, targetWordCnt) / targetWordCnt) * 100);

    console.log(
      `currentWordCnt: ${currentWordCnt}, targetWordCnt: ${targetWordCnt}, result: ${result}`,
    );

    return result;
  }, [totalText, targetWordCnt]);

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

      <MDRow style={styles.progressBarWrapper}>
        <WriteProgressBar progress={progress} />
        <MDText
          type="caption2Regular"
          style={styles.textGoalPage}>{`${user?.goalPage ?? 0}P`}</MDText>
      </MDRow>

      <MDView style={styles.textInputWrapper}>
        {pages.map((pageText, index) => (
          <MDCol key={`input-${index}`}>
            <TextInput
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              value={pageText}
              placeholder={
                index === 0 ? '오늘 아침에는 어떤 생각이 떠오르시나요?' : '계속해서 적어보세요...'
              }
              maxLength={WORD_CNT_PER_PAGE}
              onChangeText={(text) => handleTextChange(text, index)}
              multiline={true}
            />
            <MDText style={styles.pageNumberText} type="labelRegular">
              {`${index + 1}페이지`}
            </MDText>
          </MDCol>
        ))}
      </MDView>
    </MDView>
  );
}

const screenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    progressBarWrapper: {
      paddingTop: 52,
      paddingBottom: 12,
      paddingStart: 28,
      paddingEnd: 16,
      alignItems: 'center',
      gap: 12,
    },
    textGoalPage: {
      color: colors.text.brand,
    },
    textInputWrapper: {
      flex: 1,
      paddingHorizontal: 24,
      position: 'relative',
    },
    page: {
      padding: 24,
    },
    pageNumberText: {
      color: colors.text.alternative,
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
