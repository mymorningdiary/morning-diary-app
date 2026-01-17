import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { router } from 'expo-router';
import { LoginEmailForm } from './LoginEmailForm';
import { useKeyboardVisible } from '@shared/lib/keyboard';

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
          onGoSignUp={handleGoSignUp}
          onGoResetPassword={handleGoResetPassword}
          bottomSpacing={keyboardVisible ? KEYBOARD_SPACING : 0}
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
