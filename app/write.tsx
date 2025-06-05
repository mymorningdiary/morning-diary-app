import { MDProgressBar, MDRow, MDText, MDView } from '@/components';
import { WriteAppBar } from '@/components/write';
import { useUser } from '@/contexts/UserContext';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';

const WORD_CNT_PER_PAGE = 450;
const INACTIVE_WORD_CNT = 60;

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
  const targetTextCnt = useMemo(() => {
    const goalPage = user?.goalPage ?? 1;
    return goalPage * WORD_CNT_PER_PAGE;
  }, [user?.goalPage]);

  const [currentText, setCurrentText] = useState<string>('');
  const [inactiveText, setInactiveText] = useState<string>('');

  const progress = useMemo(() => {
    const totalTextCnt = currentText.length + inactiveText.length;
    const result = Math.floor((Math.min(totalTextCnt, targetTextCnt) / targetTextCnt) * 100);

    return result;
  }, [currentText, inactiveText, targetTextCnt]);

  const onInactiveTextPress = useCallback(() => {
    console.log('touch inactive text');
  }, []);

  // 텍스트 비활성화 로직
  useEffect(() => {
    if (currentText.length > INACTIVE_WORD_CNT) {
      const currentInactiveText = currentText.slice(0, INACTIVE_WORD_CNT);
      const restText = currentText.slice(INACTIVE_WORD_CNT);

      setCurrentText(restText);
      setInactiveText(inactiveText + currentInactiveText);
    }
  }, [currentText, inactiveText]);

  const scrollViewRef = useRef<ScrollView>(null);

  const handleContentSizeChange = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
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
            style={styles.textGoalPage}
            type="caption2Regular"
            onPress={() => setModalVisible(true)}>
            {`${user?.goalPage ?? 0}페이지`}
          </MDText>
        </MDRow>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.containerScrollContent}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={handleContentSizeChange}>
          <MDView style={styles.containerText}>
            {inactiveText.length > 0 && (
              <MDText style={styles.inactiveText} type="bodyRegular" onPress={onInactiveTextPress}>
                {inactiveText}
              </MDText>
            )}
            <TextInput
              style={styles.textInput}
              value={currentText}
              onChangeText={setCurrentText}
              placeholder="오늘 아침에는 어떤 생각이 떠오르나요?"
              multiline
              scrollEnabled={false}
            />
          </MDView>
        </ScrollView>
      </MDView>
    </>
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
      paddingBottom: 30,
      paddingEnd: 24,
      alignItems: 'center',
    },
    textGoalPage: {
      color: colors.text.brand,
    },
    containerScrollContent: {
      paddingHorizontal: 24,
      flexGrow: 1,
    },
    containerText: {
      flex: 1,
    },
    inactiveText: {
      color: colors.text.alternative,
    },
    textInput: {
      fontFamily: 'Pretendard-Regular',
      fontWeight: '400',
      fontSize: 16,
      textAlignVertical: 'top',
      minHeight: 200,
      padding: 0,
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
