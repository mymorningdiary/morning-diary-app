import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { router } from 'expo-router';
import { LoginEmailForm } from './LoginEmailForm';
import { useKeyboardVisible } from '@shared/lib/keyboard';
import { useToastStore } from '@shared/lib/toast';

const KEYBOARD_SPACING = 16;

export function LoginEmailPage() {
  const styles = PageStyles;
  const keyboardVisible = useKeyboardVisible();

  const handleGoSignUp = () => {
    // 회원가입 화면 이동
  };

  const handleGoResetPassword = () => {
    // 비밀번호 재설정 화면 이동
  };

  const handleLoginSuccess = (isExistUser: boolean) => {
    // router.replace(isExistUser ? '/(app)' : '/(app)/alarm-permission');
    router.replace('/(app)');
  };

  const handleLoginError = (message: string) => {
    useToastStore.getState().show({ type: 'error', message });
  };

  return (
    <MDPage
      style={[
        styles.container,
        keyboardVisible && Platform.OS === 'android' && { paddingBottom: 0 },
      ]}>
      <MDAppBar title="이메일 로그인" onBack={() => router.back()} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <LoginEmailForm
          bottomSpacing={keyboardVisible ? KEYBOARD_SPACING : 0}
          onGoSignUp={handleGoSignUp}
          onGoResetPassword={handleGoResetPassword}
          onLoginSuccess={handleLoginSuccess}
          onLoginError={handleLoginError}
        />
      </KeyboardAvoidingView>
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
});
