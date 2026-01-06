import { TERMS_URL_PRIVACY, TERMS_URL_USE } from '@shared/config/legal';
import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export function TermsTextBox() {
  const { text } = useThemeColor();
  const styles = BoxStyles;

  const navigateToWebView = (webviewURL: string) => {
    router.push({
      pathname: '/web-view',
      params: { webviewURL },
    });
  };

  return (
    <View style={styles.container}>
      <MDText type="caption1Regular" color={text.normal} align="center">
        {`계속하기를 진행하시면 `}
        <Text style={styles.linkText} onPress={() => navigateToWebView(TERMS_URL_PRIVACY)}>
          {`개인정보 처리방침\n`}
        </Text>
        {` 및 `}
        <Text style={styles.linkText} onPress={() => navigateToWebView(TERMS_URL_USE)}>
          이용약관
        </Text>
        {`에 동의하게 됩니다.`}
      </MDText>
    </View>
  );
}

const BoxStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});
