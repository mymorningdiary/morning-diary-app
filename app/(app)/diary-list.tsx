import { MDText } from '@/components';
import DiaryListAppBar from '@/components/diary-list/DiaryListAppBar';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colors = useThemeColor();
  const styles = ScreenStyles({ colors });

  const { date } = useLocalSearchParams<{ date?: string }>();

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <View style={styles.container}>
        <DiaryListAppBar />
        <View style={styles.headerSection}>
          <MDText type="heading2SemiBold" color={colors.text.brand}>
            {date}
          </MDText>
        </View>

        <View style={styles.listSection}>
          <MDText type="labelRegular" color={colors.text.brand}>
            {'아침일기 '}
            <MDText type="labelSemiBold" color={colors.text.brand}>
              {0}
            </MDText>
            개
          </MDText>
        </View>
      </View>
    </SafeAreaView>
  );
}

const ScreenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    containerSafeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    headerSection: {
      paddingTop: 16,
      paddingBottom: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listSection: {
      paddingHorizontal: 12,
      gap: 12,
    },
  });
