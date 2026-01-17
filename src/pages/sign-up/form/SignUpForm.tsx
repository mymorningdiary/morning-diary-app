import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { PASSWORD_MAX_LEN } from '@shared/lib/validation';
import { MDButton } from '@shared/ui/Button';
import { MDFieldState, MDTextField } from '@shared/ui/TextField';

interface Props {
  keyboardSpacing?: number;
  onSignUpSuccess?: (isExistUser: boolean) => void;
  onSignUpError?: (message: string) => void;
}

export function SignUpForm({ keyboardSpacing = 0, onSignUpSuccess, onSignUpError }: Props) {
  const styles = FormStyles;

  const emailRef = useRef<TextInput | null>(null);
  const otpRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const confirmPasswordRef = useRef<TextInput | null>(null);

  const [email, setEmail] = useState<MDFieldState>({});
  const [otp, setOtp] = useState<MDFieldState>({});
  const [password, setPassword] = useState<MDFieldState>({});
  const [confirmPassword, setConfirmPassword] = useState<MDFieldState>({});

  const handleEmailChange = (value: string) => {
    setEmail({ value, status: 'default', message: null });
  };

  const handleOtpChange = (value: string) => {
    setOtp({ value, status: 'default', message: null });
  };

  const handlePasswordChange = (value: string) => {
    setPassword({ value, status: 'default', message: null });
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword({ value, status: 'default', message: null });
  };

  // 화면 진입시 포커싱 자동
  useEffect(() => {
    const id = setTimeout(() => {
      emailRef.current?.focus();
    }, 0);

    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.textFieldContent}>
          <MDTextField
            ref={emailRef}
            label="아이디"
            placeholder="이메일 주소"
            returnKeyType="next"
            keyboardType="email-address"
            {...email}
            onChangeText={handleEmailChange}
            onSubmitEditing={() => otpRef.current?.focus()}
          />

          <MDTextField
            ref={otpRef}
            label="인증 번호"
            placeholder="이메일을 확인해주세요"
            returnKeyType="next"
            keyboardType="decimal-pad"
            inputMode="numeric"
            maxLength={6}
            {...otp}
            onChangeText={handleOtpChange}
            onSubmitEditing={() => passwordRef?.current?.focus()}
          />

          <MDTextField
            ref={passwordRef}
            label="비밀번호"
            placeholder="영문,숫자,특수문자 포함 10자리 이상"
            secureTextEntry
            returnKeyType="next"
            maxLength={PASSWORD_MAX_LEN}
            {...password}
            onChangeText={handlePasswordChange}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />

          <MDTextField
            ref={confirmPasswordRef}
            label="비밀번호 확인"
            placeholder="영문,숫자,특수문자 포함 10자리 이상"
            secureTextEntry
            returnKeyType="done"
            maxLength={PASSWORD_MAX_LEN}
            {...confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            onSubmitEditing={() => {}}
          />
        </View>
      </ScrollView>

      <MDButton
        style={{ marginHorizontal: 16, marginVertical: keyboardSpacing }}
        label="가입하기"
        loading={false}
        onPress={() => {}}
      />
    </>
  );
}

const FormStyles = StyleSheet.create({
  textFieldContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 60,
    gap: 24,
  },
});
