import { DiaryListItem, MDLargeSpeechBubble, MDText } from '@/components';
import DiaryListAppBar from '@/components/diary-list/DiaryListAppBar';
import { diaryAPI } from '@/core/api';
import { Diary } from '@/core/types';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DiaryListScreen() {
  const colors = useThemeColor();
  const styles = ScreenStyles({ colors });

  const { date } = useLocalSearchParams<{ date?: string }>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['diary-list', date],
    queryFn: () => diaryAPI.getDiaries({ date: date ?? '' }),
  });

  const [diaryInfos, setDiaryInfos] = useState<Diary[] | null>(null);

  const onNavigateBack = () => {
    router.back();
  };

  const onNavigateToReadDiary = (diary: Diary) => {
    const writtenDate = dayjs(diary.writtenDate, 'YYYY-MM-DD');
    const dateParam = `year=${writtenDate.year}&month=${writtenDate.month}&day=${writtenDate.day}`;
    router.push(`/read-diary?${dateParam}&diaryId=${diary.diaryId}`);
  };

  useEffect(() => {
    if (data && data.code === 2000) {
      setDiaryInfos(data.data.diaryInfos);
    }
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <View style={styles.container}>
        <DiaryListAppBar onNavigateBack={onNavigateBack} />
        <View style={styles.headerSection}>
          <MDText type="heading2SemiBold" color={colors.text.brand}>
            {dayjs(date, 'YYYY-MM').format('YY년 M월')}
          </MDText>
        </View>

        <View style={styles.listSection}>
          <MDText type="labelRegular" color={colors.text.brand}>
            {'아침일기 '}
            <MDText type="labelSemiBold" color={colors.text.brand}>
              {diaryInfos?.length ?? 0}
            </MDText>
            개
          </MDText>

          {diaryInfos?.length !== 0 && (
            <ScrollView
              contentContainerStyle={styles.diaryList}
              showsVerticalScrollIndicator={false}
              overScrollMode="never">
              {diaryInfos?.reverse().map((diaryInfo, i) => (
                <DiaryListItem key={i} diaryInfo={diaryInfo} onPress={onNavigateToReadDiary} />
              ))}
            </ScrollView>
          )}

          {(diaryInfos === null || diaryInfos.length === 0) && (
            <View style={styles.emptySection}>
              <MDLargeSpeechBubble text={'작성된 아침일기가 없어요'} />
              <Image
                style={{ width: 93, height: 93 }}
                source={require('@/assets/images/img-sun-basic.png')}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const ScreenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    containerSafeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    headerSection: {
      paddingTop: 16,
      paddingBottom: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listSection: {
      flex: 1,
      paddingHorizontal: 12,
      gap: 12,
    },
    diaryList: {
      gap: 16,
      paddingBottom: 40,
    },
    emptySection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -100,
    },
  });
