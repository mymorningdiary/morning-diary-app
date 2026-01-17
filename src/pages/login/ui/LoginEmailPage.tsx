import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { router } from 'expo-router';
import { LoginEmailForm } from './LoginEmailForm';

export function LoginEmailPage() {
  const styles = PageStyles;

  return (
    <MDPage style={styles.container}>
      <MDAppBar title="이메일 로그인" onBack={() => router.back()} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} bounces={false}>
          <LoginEmailForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </MDPage>
  );
}

const PageStyles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
});
