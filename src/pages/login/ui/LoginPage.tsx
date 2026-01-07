import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { IconMail } from '@assets/icons';

import { MDButton } from '@shared/ui/MDButton';
import { MDLogo } from '@shared/ui/MDLogo';
import { MDPage } from '@shared/ui/MDPage';
import { useToastStore } from '@shared/lib/toast';
import { KakaoLoginButton } from '@features/login';

import { TermsTextBox } from './TermsTextBox';

export function LoginPage() {
  const styles = PageStyles;

  const handleEmailPress = () => {
    router.push('/login-email');
  };

  const handleLoginSuccess = (isExistUser: boolean) => {
    router.replace(isExistUser ? '/(app)' : '/(app)/alarm-permission');
  };

  const handleLoginError = (message: string) => {
    useToastStore.getState().show({ message, variant: 'error' });
  };

  return (
    <MDPage style={styles.container}>
      <MDLogo style={styles.logoContent} />

      <View style={styles.buttonContent}>
        <MDButton
          variant="outline"
          prefix={IconMail}
          label="이메일로 계속하기"
          onPress={handleEmailPress}
        />
        <KakaoLoginButton onSuccess={handleLoginSuccess} onError={handleLoginError} />
      </View>

      <TermsTextBox />
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  logoContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  buttonContent: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
});
