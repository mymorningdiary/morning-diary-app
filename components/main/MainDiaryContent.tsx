import { useThemeColor } from '@/hooks';
import { MDColors, Nullable } from '@/types';
import { StyleSheet } from 'react-native';
import { MDView } from '../MDView';
import { MDCol } from '../MDCol';

import DiaryListItem from '../DiaryListItem';
import { Image } from 'expo-image';
import { MDLargeSpeechBubble } from '../SpeechBubbles/MDLargeSpeechBubble';
import { Diary } from '@/core/types';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getRandomMessage } from '@/utils/arrays';

type MainDiaryContentProps = {
  diaryInfo: Nullable<Diary>;
  onDiaryItemPress?: (diary: Diary) => void;
};

const GREETING_MESSAGES = [
  '좋은 아침이에요',
  '오늘 하루가 시작됐어요!',
  '오늘 하루도 화이팅🧡',
  '행복한 하루가 되길 바랄게요',
  '평안한 하루가 되길 바랄게요',
  '햇님이와 하루를 시작해볼까요?',
  '오늘도 햇님이와 함께해요',
  '햇님이랑 어제보다 더 멋진 오늘을 만들어봐요',
  '아침의 설렘을 기록해봐요',
  '오늘도 나를 위한 기록을 남겨볼까요?',
  '오늘은 어떤 하루가 될까요?',
  '좋은 아침~ 나의 기분을 말해봐요',
  '하루의 시작을 열어볼까요?',
  '아침에 흘러가는 감정들을 적어볼까요?',
];

export default function MainDiaryContent({ diaryInfo, onDiaryItemPress }: MainDiaryContentProps) {
  const colors = useThemeColor();
  const styles = contentStyles({ colors });
  const [greetingMessage, setGreetingMessage] = useState(GREETING_MESSAGES[0]);

  useFocusEffect(
    useCallback(() => {
      const message = getRandomMessage(GREETING_MESSAGES);
      setGreetingMessage(message);
    }, []),
  );

  if (!diaryInfo) {
    return (
      <MDCol style={styles.containerEmpty}>
        <MDLargeSpeechBubble text={greetingMessage} />
        <Image source={require('@/assets/images/img-sun-basic.png')} style={styles.image} />
      </MDCol>
    );
  }

  return (
    <MDView style={styles.containerDiary}>
      <DiaryListItem diaryInfo={diaryInfo} onPress={onDiaryItemPress} />
    </MDView>
  );
}

const contentStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    containerDiary: {
      flex: 1,
      paddingTop: 24,
      paddingHorizontal: 16,
      backgroundColor: colors.background.normal,
    },
    containerEmpty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 93,
      height: 93,
    },
  });
