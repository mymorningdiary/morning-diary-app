import { MDRow, MDText, MDView } from '@/components';
import { WriteAppBar, WriteProgressBar } from '@/components/write';
import { useUser } from '@/contexts/UserContext';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

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

  return (
    <MDView style={styles.container}>
      <WriteAppBar
        date={appBarTitle}
        isCompleteButtonEnabled={false}
        onCompleteButtonPress={() => {}}
        onBackButtonPress={() => router.back()}
      />

      <MDRow style={styles.progressBarWrapper}>
        <WriteProgressBar progress={40} />
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
    progressBarWrapper: {
      paddingTop: 52,
      paddingBottom: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      gap: 12,
    },
    textGoalPage: {
      color: colors.text.brand,
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
