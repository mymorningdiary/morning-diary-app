import { MDButton, MDText } from '@/components';
import MDTextField from '@/components/MDTextField';
import SignUpAppBar from '@/domain/sign-up/components/SignUpAppBar';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { msToMMSS } from '@/utils/dates';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MAX_OTP_MS = 180_001;
const MAX_CODE_LEN = 6;

export default function SignUpScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = ScreenStyles({ colors, bottomInset: insets.bottom });

  const otpRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const confirmPasswordRef = useRef<TextInput | null>(null);

  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [canRequestOTP, setCanRequestOTP] = useState(false);
  const [showVerifyOTP, setShowVerifyOTP] = useState(true);
  const [remainingTime, setRemainingTime] = useState(MAX_OTP_MS);
  const [canSignUp, setCanSignUp] = useState(false);

  const handleChangeEmail = (text: string) => {
    setEmail(text);
  };

  const handleChangeOTP = (text: string) => {
    setOTP(text);
  };

  const handleChangePassword = (text: string) => {
    setPassword(text);
  };

  const handleChangeConfirmPassword = (text: string) => {
    setConfirmPassword(text);
  };

  const handleRequestOTP = () => {};

  const handleSignUp = () => {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <SignUpAppBar onNavigateBack={() => router.back()} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled">
          <View style={styles.textFieldRow}>
            <MDTextField
              containerStyle={{ flex: 1 }}
              label="이메일"
              placeholder="morning-diary@example.com"
              value={email}
              returnKeyType="next"
              keyboardType="email-address"
              inputMode="email"
              onChangeText={handleChangeEmail}
              onSubmitEditing={() => passwordRef?.current?.focus()}
            />

            <MDButton
              style={styles.requestCodeButton}
              textType="labelRegular"
              title={'인증 요청'}
              disabled={!canRequestOTP}
              onPress={handleRequestOTP}
            />
          </View>

          {showVerifyOTP && (
            <View style={styles.textFieldRow}>
              <MDTextField
                ref={otpRef}
                containerStyle={{ flex: 1 }}
                label="인증 번호"
                placeholder="이메일을 확인해주세요"
                value={otp}
                returnKeyType="next"
                keyboardType="decimal-pad"
                inputMode="numeric"
                maxLength={MAX_CODE_LEN}
                onChangeText={handleChangeOTP}
                onSubmitEditing={() => passwordRef?.current?.focus()}
              />

              <MDText type="labelRegular" color={colors.text.alternative}>
                {msToMMSS(remainingTime)}
              </MDText>
            </View>
          )}

          <MDTextField
            ref={passwordRef}
            label="비밀번호"
            placeholder="영문+숫자+특수문자 포함 8자리"
            value={password}
            secureTextEntry
            returnKeyType="next"
            onChangeText={handleChangePassword}
            onSubmitEditing={() => confirmPasswordRef?.current?.focus()}
          />

          <MDTextField
            ref={confirmPasswordRef}
            label="비밀번호 확인"
            placeholder="영문+숫자+특수문자 포함 8자리"
            value={confirmPassword}
            secureTextEntry
            returnKeyType="done"
            onChangeText={handleChangeConfirmPassword}
          />
        </ScrollView>

        <View style={styles.footer}>
          <MDButton title={'가입하기'} disabled={!canSignUp} onPress={handleSignUp} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const ScreenStyles = ({ colors, bottomInset }: { colors: MDColors; bottomInset: number }) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    keyboardAvoider: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: bottomInset + 80, // 버튼 높이 + 여유
      gap: 24,
    },
    textFieldRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 12,
    },
    requestCodeButton: {
      width: 72,
      height: 32,
      borderRadius: 8,
    },
    footer: {
      paddingTop: 16,
      paddingHorizontal: 16,
      paddingBottom: 60 - bottomInset,
    },
  });
