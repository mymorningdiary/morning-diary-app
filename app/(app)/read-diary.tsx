import { MDText } from '@/components';
import AppBar from '@/domain/read-diary/AppBar';
import RemoveDiaryModal from '@/domain/read-diary/RemoveDiaryModal';
import { useGetDiary, useRemoveDiary, useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { checkToday } from '@/utils/dates';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReadDiaryScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = ScreenStyles({ colors, bottomInset: insets.bottom });

  const { year, month, day, diaryId } = useLocalSearchParams();

  const isToday = useMemo(
    () => checkToday({ year: Number(year), month: Number(month), day: Number(day) }),
    [year, month, day],
  );

  const appBarTitle = useMemo(() => {
    return formatDateToAppBarTitle({
      year: Number(year),
      month: Number(month),
      day: Number(day),
    });
  }, [year, month, day]);

  const { diary } = useGetDiary({ diaryId: Number(diaryId) });
  const { mutate: removeDiary, isRemoved } = useRemoveDiary({ diaryId: Number(diaryId) });

  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState(false);

  const navigateBack = () => {
    router.back();
  };

  const openRemoveModal = () => {
    setIsOpenRemoveModal(true);
  };

  const closeRemoveModal = () => {
    setIsOpenRemoveModal(false);
  };

  const handleRemoveDiary = () => {
    closeRemoveModal();
    removeDiary();
  };

  const navigateToUpdateDiary = () => {
    if (isToday === false) return;
    router.replace(`/update-diary?year=${year}&month=${month}&day=${day}&diaryId=${diaryId}`);
  };

  useEffect(() => {
    if (isRemoved) {
      router.back();
    }
  }, [isRemoved]);

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <View style={styles.container}>
        <AppBar
          title={appBarTitle}
          onBackButtonPress={navigateBack}
          onUpdateButtonPress={isToday ? navigateToUpdateDiary : undefined}
          onRemoveButtonPress={openRemoveModal}
        />

        {diary && (
          <ScrollView
            contentContainerStyle={styles.containerContent}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}>
            <View>
              <MDText type="bodyRegular">{diary.content}</MDText>
            </View>
          </ScrollView>
        )}

        <RemoveDiaryModal
          title="일기를 삭제할까요?"
          opened={isOpenRemoveModal}
          closeModal={closeRemoveModal}
          removeDiary={handleRemoveDiary}
        />
      </View>
    </SafeAreaView>
  );
}

const ScreenStyles = ({ colors, bottomInset }: { colors: MDColors, bottomInset: number }) =>
  StyleSheet.create({
    containerSafeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    containerContent: {
      paddingTop: 24,
      paddingHorizontal: 24,
      paddingBottom: 40 - bottomInset,
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
