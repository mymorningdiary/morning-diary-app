import { MDText } from '@/components';
import AppBar from '@/domain/read-diary/AppBar';
import RemoveDiaryModal from '@/domain/read-diary/RemoveDiaryModal';
import { useGetDiary, useRemoveDiary, useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function ReadDiaryScreen() {
  const colors = useThemeColor();
  const styles = useMemo(() => ScreenStyles({ colors }), [colors]);

  const { year, month, day, diaryId } = useLocalSearchParams();

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

  useEffect(() => {
    if (isRemoved) {
      router.back();
    }
  }, [isRemoved]);

  return (
    <View style={styles.container}>
      <AppBar
        title={appBarTitle}
        onBackButtonPress={navigateBack}
        onUpdateButtonPress={() => {}}
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
  );
}

const ScreenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    containerContent: {
      paddingTop: 24,
      paddingHorizontal: 24,
      paddingBottom: 40,
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
