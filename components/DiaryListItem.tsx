import { Diary } from '@/core/types';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image, StyleSheet } from 'react-native';
import { MDCol } from './MDCol';
import MDPressable from './MDPressable';
import { MDText } from './MDText';

type DiaryListItemProps = {
  diaryInfo: Diary;
  onPress?: (diary: Diary) => void;
};

export default function DiaryListItem({ diaryInfo, onPress }: DiaryListItemProps) {
  const colors = useThemeColor();
  const styles = diaryListItemStyles({ colors });
  const { dayOfWeek, previewContent, writtenDate } = diaryInfo;

  const handlePress = () => {
    onPress?.(diaryInfo);
  };

  return (
    <MDPressable style={styles.container} onPress={handlePress}>
      <MDCol style={styles.containerLeft}>
        <Image source={require('@/assets/images/img-sun-mini.png')} style={styles.iconLeft} />
        <MDText type="labelSemiBold" style={styles.textLeft}>
          {`${writtenDate.slice(8)} ${dayOfWeek}`}
        </MDText>
      </MDCol>
      <MDText type="labelRegular" style={styles.text} numberOfLines={2} ellipsizeMode="tail">
        {previewContent}
      </MDText>
    </MDPressable>
  );
}

const diaryListItemStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    container: {
      height: 76,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary.faint,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
    },
    containerLeft: {
      alignItems: 'center',
      paddingHorizontal: 4,
      backgroundColor: 'transparent',
      width: 48,
    },
    iconLeft: {
      width: 32,
      height: 32,
    },
    textLeft: {
      color: colors.primary.normal,
    },
    textContainer: {
      flex: 1,
    },
    text: {
      flex: 1,
      color: colors.text.alternative,
    },
  });
