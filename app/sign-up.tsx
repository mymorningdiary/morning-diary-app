import { MDView } from '@/components';
import MDTextField from '@/components/MDTextField';
import SignUpAppBar from '@/domain/sign-up/components/SignUpAppBar';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = ScreenStyles({ colors, bottomInset: insets.bottom });

  const passwordRef = useRef<TextInput | null>(null);
  const confirmPasswordRef = useRef<TextInput | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onChangeEmail = (text: string) => {
    setEmail(text);
  };

  const onChangePassword = (text: string) => {
    setPassword(text);
  };

  const onChangeConfirmPassword = (text: string) => {
    setConfirmPassword(text);
  };

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <MDView style={styles.container}>
        <SignUpAppBar onNavigateBack={() => router.back()} />

        <MDView style={styles.inputSection}>
          <MDTextField
            label="이메일"
            placeholder="morning-diary@example.com"
            value={email}
            returnKeyType="next"
            keyboardType="email-address"
            inputMode="email"
            onChangeText={onChangeEmail}
            onSubmitEditing={() => passwordRef?.current?.focus()}
          />

          <MDTextField
            ref={passwordRef}
            label="비밀번호"
            placeholder="영문+숫자+특수문자 포함 8자리"
            value={password}
            secureTextEntry
            returnKeyType="next"
            onChangeText={onChangePassword}
            onSubmitEditing={() => confirmPasswordRef?.current?.focus()}
          />

          <MDTextField
            ref={confirmPasswordRef}
            label="비밀번호 확인"
            placeholder="영문+숫자+특수문자 포함 8자리"
            value={confirmPassword}
            secureTextEntry
            returnKeyType="done"
            onChangeText={onChangeConfirmPassword}
          />
        </MDView>
      </MDView>
    </SafeAreaView>
  );
}

const ScreenStyles = ({ colors, bottomInset }: { colors: MDColors; bottomInset: number }) =>
  StyleSheet.create({
    containerSafeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    container: {
      flex: 1,
      paddingBottom: 20 - bottomInset,
      backgroundColor: colors.background.normal,
    },
    inputSection: {
      paddingTop: 16,
      paddingHorizontal: 16,
      gap: 24,
    },
  });
