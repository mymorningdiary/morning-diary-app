import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import { useToastStore } from '@shared/lib/toast';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { SignUpForm } from './SignUpForm';

export function SignUpFormPage() {
  const styles = PageStyles;

  const handleSignUpSuccess = (isExistUser: boolean) => {
    router.replace({
      pathname: '/(app)/sign-up-complete',
      params: { isExistUser: isExistUser ? 'true' : 'false' },
    });
  };

  const handleSignUpError = (message: string) => {
    useToastStore.getState().show({ type: 'error', message });
  };

  return (
    <MDPage style={[styles.container]}>
      <MDAppBar title="회원가입" onBack={() => router.back()} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SignUpForm onSignUpSuccess={handleSignUpSuccess} onSignUpError={handleSignUpError} />
      </KeyboardAvoidingView>
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
});
