import { useThemeColor } from '@/hooks';
import { MDColors, Nullable } from '@/types';
import { StyleSheet } from 'react-native';
import { MDView } from '../MDView';
import { MDCol } from '../MDCol';
import { Diary } from '@/core/api';
import DiaryListItem from '../DiaryListItem';
import { Image } from 'expo-image';
import { MDSpeechBubble } from '../MDSpeechBubble';

type MainDiaryContentProps = {
  diaryInfo: Nullable<Diary.DiaryInfo>;
};

export default function MainDiaryContent({ diaryInfo }: MainDiaryContentProps) {
  const colors = useThemeColor();
  const styles = contentStyles({ colors });

  if (!diaryInfo) {
    return (
      <MDCol style={styles.containerEmpty}>
        <MDSpeechBubble text="아침에 흘러가는 감정들을 적어볼까요?" />
        <Image source={require('@/assets/images/img-sun-basic.png')} style={styles.image} />
      </MDCol>
    );
  }

  return (
    <MDView style={styles.containerDiary}>
      <DiaryListItem diaryInfo={diaryInfo} />
    </MDView>
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
    image: {
      width: 93,
      height: 93,
    },
  });
