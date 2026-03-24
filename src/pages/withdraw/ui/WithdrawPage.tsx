import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useThemeColor } from '@shared/lib/theme';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDButton } from '@shared/ui/Button';
import { MDPage } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';
import { useWithdraw } from '@entities/user';
import { useToastStore } from '@shared/lib/toast';

export function WithdrawPage() {
  const colors = useThemeColor();
  const styles = PageStyles;
  const { withdraw, isPending } = useWithdraw({
    onError: (message) => {
      if (!message) return;
      useToastStore.getState().show({ type: 'error', message });
    },
  });

  const handleWithdraw = () => {
    if (isPending) return;
    withdraw();
  };

  return (
    <MDPage style={styles.container}>
      <MDAppBar title="회원 탈퇴" onBack={() => router.back()} />

      <View style={styles.content}>
        <View style={styles.textContent}>
          <MDText type="titleSemiBold" color={colors.text.brand} align="center">
            회원탈퇴 유의사항
          </MDText>

          <MDText type="labelRegular" color={colors.text.brand} align="center">
            {`탈퇴하시면 작성한 아침일기는 모두 삭제돼요.\n\n같은 계정으로 재가입 시,\n작성한 아침일기가 복구됩니다.`}
          </MDText>
        </View>

        <MDButton
          style={styles.button}
          label="탈퇴하기"
          loading={isPending}
          onPress={handleWithdraw}
        />
      </View>
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  content: {
    flex: 1,
  },
  textContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 20,
  },
  button: {
    marginHorizontal: 16,
  },
});
