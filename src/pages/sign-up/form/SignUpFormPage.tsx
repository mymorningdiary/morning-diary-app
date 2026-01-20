import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import { useKeyboardVisible } from '@shared/lib/keyboard';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { SignUpForm } from './SignUpForm';
import { useToastStore } from '@shared/lib/toast';

const KEYBOARD_SPACING = 16;

export function SignUpFormPage() {
  const styles = PageStyles;
  const keyboardVisible = useKeyboardVisible();

  const handleSignUpSuccess = (isExistUser: boolean) => {
    router.replace(isExistUser ? '/(app)' : '/(app)/alarm-permission');
  };

  const handleSignUpError = (message: string) => {
    useToastStore.getState().show({ type: 'error', message });
  };

  return (
    <MDPage
      style={[
        styles.container,
        keyboardVisible && Platform.OS === 'android' && { paddingBottom: 0 },
      ]}>
      <MDAppBar title="회원가입" onBack={() => router.back()} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SignUpForm
          keyboardSpacing={keyboardVisible ? KEYBOARD_SPACING : 0}
          onSignUpSuccess={handleSignUpSuccess}
          onSignUpError={handleSignUpError}
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
