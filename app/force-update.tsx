import { MDButton, MDText, MDView } from '@/components';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { openStoreLink } from '@/utils/links';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// TODO 디자인 변경
export default function ForceUpdateScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = screenStyles({ colors, bottomInset: insets.bottom });

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <MDView style={styles.container}>
        <View style={styles.contentContainer}>
          <MDText type="bodyRegular" style={styles.title}>
            {`아침일기가 사용성 개선을 위해 업데이트를 준비했어요.\n지금 바로 만나보세요 🌞`}
          </MDText>
        </View>
        <MDView style={styles.bottomContainer}>
          <MDButton title={'업데이트 하기'} onPress={openStoreLink} />
        </MDView>
      </MDView>
    </SafeAreaView>
  );
}

const screenStyles = ({ colors, bottomInset }: { colors: MDColors; bottomInset: number }) =>
  StyleSheet.create({
    containerSafeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      textAlign: 'center',
      color: colors.text.brand,
    },
    bottomContainer: {
      paddingHorizontal: 16,
      paddingBottom: 60 - bottomInset,
    },
  });
