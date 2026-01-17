import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRef, useState } from 'react';

import { useLoginEmail } from '@features/login';
import { MDButton } from '@shared/ui/Button';
import { MDText } from '@shared/ui/Text';
import { MDFieldState, MDTextField } from '@shared/ui/TextField';
import { validateEmail, validatePassword } from '@shared/lib/validation';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { Logger } from '@shared/lib/log';

interface Props {
  bottomSpacing?: number;
  onGoSignUp?: () => void;
  onGoResetPassword?: () => void;
  onLoginSuccess?: (isExistUser: boolean) => void;
  onLoginError?: (message: string) => void;
}

export function LoginForm({
  bottomSpacing = 0,
  onGoSignUp,
  onGoResetPassword,
  onLoginSuccess,
  onLoginError,
}: Props) {
  const colors = useThemeColor();
  const styles = FormStyles({ colors });

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const [email, setEmail] = useState<MDFieldState>({});
  const [password, setPassword] = useState<MDFieldState>({});

  const { loginEmail, isPending } = useLoginEmail({
    onSuccess: onLoginSuccess,
    onError: ({ type, message }) => {
      if (type === 'email') {
        setEmail((prev) => ({ ...prev, status: 'error', message }));
        return;
      }
      if (type === 'password') {
        setPassword((prev) => ({ ...prev, status: 'error', message }));
        return;
      }
      onLoginError?.(message);
    },
  });

  const handleEmailChange = (value: string) => {
    setEmail({ value, status: 'default', message: null });
  };

  const handlePasswordChange = (value: string) => {
    setPassword({ value, status: 'default', message: null });
  };

  const handleSubmit = async () => {
    const emailValue = email.value ?? '';
    const passwordValue = password.value ?? '';
    Logger('LoginEmailForm').debug('email: ', emailValue, 'password: ', passwordValue);

    const emailValidation = validateEmail(emailValue);
    const passwordValidation = validatePassword(passwordValue);

    setEmail((prev) => ({
      ...prev,
      status: emailValidation.isValid ? 'success' : 'error',
      message: emailValidation.message,
    }));

    setPassword((prev) => ({
      ...prev,
      status: passwordValidation.isValid ? 'success' : 'error',
      message: passwordValidation.message,
    }));

    if (!emailValidation.isValid || !passwordValidation.isValid) return;

    loginEmail({ email: emailValue, password: passwordValue });
  };

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
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <MDTextField
            ref={passwordRef}
            label="비밀번호"
            placeholder="비밀번호"
            secureTextEntry
            returnKeyType="done"
            {...password}
            onChangeText={handlePasswordChange}
            onSubmitEditing={handleSubmit}
          />
        </View>
      </ScrollView>

      <View style={[styles.buttonContent, { paddingBottom: bottomSpacing }]}>
        <MDButton label="로그인" loading={isPending} onPress={handleSubmit} />
        <MDButton variant="outline" label="회원가입" onPress={onGoSignUp} />

        <Pressable hitSlop={10} onPress={onGoResetPassword}>
          <MDText type="labelRegular" color={colors.text.alternative}>
            비밀번호 재설정
          </MDText>
        </Pressable>
      </View>
    </>
  );
}

const FormStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    textFieldContent: {
      paddingTop: 16,
      paddingHorizontal: 16,
      paddingBottom: 60,
      gap: 24,
    },
    buttonContent: {
      alignItems: 'center',
      paddingHorizontal: 16,
      gap: 10,
    },
  });
