import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import { useToastStore } from '@shared/lib/toast';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { ResetPasswordForm } from './ResetPasswordForm';

export function ResetPasswordFormPage() {
  const styles = PageStyles;

  const handleResetSuccess = () => {
    router.replace('/(reset-password)/complete');
  };

  const handleResetError = (message: string) => {
    useToastStore.getState().show({ type: 'error', message });
  };

  return (
    <MDPage style={[styles.container]}>
      <MDAppBar title="비밀번호 재설정" onBack={() => router.back()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ResetPasswordForm onResetSuccess={handleResetSuccess} onResetError={handleResetError} />
      </KeyboardAvoidingView>
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
});
