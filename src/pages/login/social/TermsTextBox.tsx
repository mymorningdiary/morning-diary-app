import { TERMS_PRIVACY_URL, TERMS_USE_URL } from '@shared/config';
import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export function TermsTextBox() {
  const { text } = useThemeColor();
  const styles = BoxStyles;

  return (
    <View style={styles.container}>
      <MDText type="caption1Regular" color={text.normal} align="center">
        {`계속하기를 진행하시면 `}
        <Text
          style={styles.linkText}
          onPress={() =>
            router.push({
              pathname: '/web-view',
              params: { webviewURL: TERMS_PRIVACY_URL },
            })
          }>
          {`개인정보 처리방침\n`}
        </Text>
        {` 및 `}
        <Text
          style={styles.linkText}
          onPress={() =>
            router.push({
              pathname: '/web-view',
              params: { webviewURL: TERMS_USE_URL },
            })
          }>
          이용약관
        </Text>
        {`에 동의하게 됩니다.`}
      </MDText>

      <MDText type="caption2Regular" align="center">
        © 2025 Morning Diary
      </MDText>
    </View>
  );
}

const BoxStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});
