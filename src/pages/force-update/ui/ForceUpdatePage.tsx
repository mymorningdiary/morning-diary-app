import { StyleSheet, View } from 'react-native';

import { MDPage } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';
import { MDButton } from '@shared/ui/Button';
import { openMarketApp } from '@shared/lib/links';

export function ForceUpdatePage() {
  const styles = PageStyles;

  return (
    <MDPage style={styles.container}>
      <View style={styles.textContent}>
        <MDText type="titleSemiBold" align="center">
          {`새로운 버전이 나왔어요!`}
        </MDText>
        <MDText type="labelRegular" align="center">
          {`아침일기가 사용성 개선을 위해 업데이트를 준비했어요.\n지금 바로 만나보세요 🌞`}
        </MDText>
      </View>
      <View style={styles.buttonContent}>
        <MDButton label="업데이트 하기" onPress={openMarketApp} />
      </View>
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  textContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  buttonContent: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
});
