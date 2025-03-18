import { useThemeColor } from '@/hooks';
import { MDColors, Nullable } from '@/types';
import { Image, StyleSheet } from 'react-native';
import { MDView } from '../MDView';
import { MDCol } from '../MDCol';
import { SpeechBubble } from '../SpeechBubble';
import { Diary } from '@/core/api';
import DiaryListItem from '../DiaryListItem';

type DiaryContentProps = {
  diaryInfo: Nullable<Diary.DiaryInfo>;
};

export default function DiaryContent({ diaryInfo }: DiaryContentProps) {
  const colors = useThemeColor();
  const styles = contentStyles({ colors });

  if (diaryInfo) {
    return (
      <MDView style={styles.containerDiary}>
        <DiaryListItem diaryInfo={diaryInfo} />
      </MDView>
    );
  }

  return (
    <MDCol style={styles.containerEmpty}>
      <SpeechBubble text="아침에 흘러가는 감정들을 적어볼까요?" />
      <Image source={require('@/assets/images/img-sun-basic.png')} style={styles.imageEmpty} />
    </MDCol>
  );
}

const contentStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    containerDiary: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
    containerEmpty: {
      marginTop: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageEmpty: {
      width: 93,
      height: 93,
    },
  });
