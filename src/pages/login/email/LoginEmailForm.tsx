import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';

import { useRef, useState } from 'react';

import { MDButton } from '@shared/ui/Button';
import { MDText } from '@shared/ui/Text';
import { MDFieldState, MDTextField } from '@shared/ui/TextField';
import { validateEmail, validatePassword } from '@shared/lib/validation';

interface Props {
  onGoSignUp?: () => void;
  onGoResetPassword?: () => void;
  bottomSpacing?: number;
}

export function LoginEmailForm({ onGoSignUp, onGoResetPassword, bottomSpacing = 0 }: Props) {
  const colors = useThemeColor();
  const styles = FormStyles({ colors });

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const [email, setEmail] = useState<MDFieldState>({});
  const [password, setPassword] = useState<MDFieldState>({});

  const handleEmailChange = (value: string) => {
    setEmail({ value, status: 'default', message: null });
  };

  const handlePasswordChange = (value: string) => {
    setPassword({ value, status: 'default', message: null });
  };

  const handleSubmit = () => {
    const emailValidation = validateEmail(email.value);
    const passwordValidation = validatePassword(password.value);

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
        <MDButton label="로그인" onPress={handleSubmit} />
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
