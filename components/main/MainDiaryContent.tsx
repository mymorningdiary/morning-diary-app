import { useThemeColor } from '@/hooks';
import { MDColors, Nullable } from '@/types';
import { StyleSheet } from 'react-native';
import { MDView } from '../MDView';
import { MDCol } from '../MDCol';

import DiaryListItem from '../DiaryListItem';
import { Image } from 'expo-image';
import { MDLargeSpeechBubble } from '../SpeechBubbles/MDLargeSpeechBubble';
import { Diary } from '@/core/types';

type MainDiaryContentProps = {
  diaryInfo: Nullable<Diary>;
  onDiaryItemPress?: (diary: Diary) => void;
};

export default function MainDiaryContent({ diaryInfo, onDiaryItemPress }: MainDiaryContentProps) {
  const colors = useThemeColor();
  const styles = contentStyles({ colors });

  if (!diaryInfo) {
    return (
      <MDCol style={styles.containerEmpty}>
        <MDLargeSpeechBubble text="아침에 흘러가는 감정들을 적어볼까요?" />
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
