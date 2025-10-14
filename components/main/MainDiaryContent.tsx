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
import { GREETING_MESSAGES } from '@/constants/messages';

type MainDiaryContentProps = {
  diaryInfo: Nullable<Diary>;
  onDiaryItemPress?: (diary: Diary) => void;
};

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
