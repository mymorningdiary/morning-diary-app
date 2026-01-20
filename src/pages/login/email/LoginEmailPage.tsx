import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { useKeyboardVisible } from '@shared/lib/keyboard';
import { useToastStore } from '@shared/lib/toast';

import { LoginForm } from './LoginForm';
import { MDButton } from '@shared/ui/Button';
import { MDText } from '@shared/ui/Text';
import { useThemeColor } from '@shared/lib/theme';

const KEYBOARD_SPACING = 16;

export function LoginEmailPage() {
  const colors = useThemeColor();
  const styles = PageStyles;
  const keyboardVisible = useKeyboardVisible();

  // 키보드 show일 때 폼만 노출, 로그인 버튼만 보이게 (android 대응)
  const showOtherButtons = Platform.OS === 'ios' || !keyboardVisible;

  const handleLoginSuccess = (isExistUser: boolean) => {
    router.replace(isExistUser ? '/(app)' : '/(app)/alarm-permission');
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
        <LoginForm
          keyboardSpacing={keyboardVisible ? KEYBOARD_SPACING : 0}
          onLoginSuccess={handleLoginSuccess}
          onLoginError={handleLoginError}
        />
      </KeyboardAvoidingView>

      {showOtherButtons && (
        <View style={[styles.buttonContent]}>
          <MDButton variant="outline" label="회원가입" onPress={() => router.push('/sign-up')} />

          <Pressable hitSlop={10} onPress={() => {}}>
            <MDText type="labelRegular" color={colors.text.alternative}>
              비밀번호 재설정
            </MDText>
          </Pressable>
        </View>
      )}
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  buttonContent: {
    marginTop: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 10,
  },
});
