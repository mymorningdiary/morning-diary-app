import { MDButton, MDText, MDView } from '@/components';
import { useAppState } from '@/contexts/AppStateContext';
import { useUser } from '@/contexts/UserContext';
import SettingAppBar from '@/domain/setting/SettingAppBar';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WithdrawScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = ScreenStyles({ colors, bottomInset: insets.bottom });

  const { signOut } = useAppState();
  const { user } = useUser();

  const onNavigateBack = () => {
    router.back();
  };

  const onWithdraw = () => {};

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <View style={styles.container}>
        <SettingAppBar title="회원 탈퇴" navigateBack={onNavigateBack} />

        <View style={styles.containerText}>
          <MDText type="titleSemiBold" style={styles.title} align="center">
            회원탈퇴 유의사항
          </MDText>

          <MDText type="labelRegular" style={styles.title} align="center">
            {`탈퇴하시면 작성한 아침일기는 모두 삭제돼요.\n\n같은 계정으로 재가입 시,\n작성한 아침일기가 복구됩니다.`}
          </MDText>
        </View>

        <MDView style={styles.containerButton}>
          <MDButton title={'탈퇴하기'} onPress={onWithdraw} />
        </MDView>
      </View>
    </SafeAreaView>
  );
}

const ScreenStyles = ({ colors, bottomInset }: { colors: MDColors; bottomInset: number }) =>
  StyleSheet.create({
    containerSafeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    containerButton: {
      paddingHorizontal: 16,
      paddingBottom: 60 - bottomInset,
    },
    containerText: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: colors.text.brand,
    },
    subtitle: {
      color: colors.text.alternative,
    },
  });
