import { MDButton, MDPressable, MDText, MDView } from '@/components';
import SignUpAppBar from '@/domain/sign-up/components/SignUpAppBar';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router } from 'expo-router';
import { ReactNode, useEffect, useState } from 'react';
import { KeyboardTypeOptions, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SignUpForm {
  email: string;
  password: string;
}

export default function SignUpScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = ScreenStyles({ colors, bottomInset: insets.bottom });

  const [form, setForm] = useState<SignUpForm>({
    email: '',
    password: '',
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [timer, setTimer] = useState(0);

  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    if (!verificationRequested || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [verificationRequested, timer]);

  const isValidEmail = form.email.trim().length > 0 && form.email.includes('@');
  const isValidPassword = form.password.trim().length >= 8;
  const canSubmit = isValidPassword && isCodeVerified && !isSigningUp;
  const formattedTimer = formatTimer(timer);

  const handleChangeEmail = (value: string) => {
    setForm((prev) => ({ ...prev, email: value }));
    setEmailError(null);
    setVerificationError(null);
    setVerificationCode('');
    setIsCodeVerified(false);
    setVerificationRequested(false);
    setTimer(0);
  };

  const handleRequestVerification = async () => {
    if (!isValidEmail || isRequestingCode) return;

    if (!form.email.includes('@')) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsRequestingCode(true);
    setEmailError(null);
    setVerificationError(null);

    const result = await fakeRequestVerification(form.email);

    if (!result.ok) {
      setEmailError(result.message ?? '이메일 인증을 요청할 수 없습니다.');
      setIsRequestingCode(false);
      return;
    }

    setVerificationCode('');
    setIsCodeVerified(false);
    setVerificationRequested(true);
    setTimer(180);
    setIsRequestingCode(false);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim() || isVerifyingCode) return;

    setIsVerifyingCode(true);
    setVerificationError(null);
    const result = await fakeVerifyCode(verificationCode);

    if (!result.ok) {
      setVerificationError(result.message ?? '인증번호가 일치하지 않습니다.');
      setIsVerifyingCode(false);
      return;
    }

    setIsCodeVerified(true);
    setVerificationError(null);
    setIsVerifyingCode(false);
  };

  const handleChangePassword = (value: string) => {
    setForm((prev) => ({ ...prev, password: value }));

    if (value.trim().length === 0) {
      setPasswordError('비밀번호를 입력해주세요.');
    } else if (value.trim().length < 8) {
      setPasswordError('비밀번호는 8자 이상이어야 합니다.');
    } else {
      setPasswordError(null);
    }
  };

  const handleSignUp = async () => {
    if (!canSubmit) return;

    setIsSigningUp(true);

    const result = await fakeSignUp({
      email: form.email,
      password: form.password,
    });

    setIsSigningUp(false);

    if (result.ok) {
      router.replace('/sign-in');
    }
  };

  const emailUtility = {
    label: verificationRequested ? '다시요청' : '인증요청',
    onPress: handleRequestVerification,
    disabled: isRequestingCode || !isValidEmail,
  };

  const verificationDisabled =
    isVerifyingCode || verificationCode.trim().length < 4 || timer === 0 || isCodeVerified;

  const verificationUtility = {
    label: '인증하기',
    onPress: handleVerifyCode,
    disabled: verificationDisabled,
  };

  const passwordUtility = {
    label: isPasswordVisible ? '숨기기' : '보기',
    onPress: () => setIsPasswordVisible((prev) => !prev),
    disabled: false,
  };

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <MDView style={styles.container}>
        <SignUpAppBar onNavigateBack={() => router.back()} />

        <MDView style={styles.content}>
          <TextField
            label="이메일"
            value={form.email}
            placeholder="이메일을 입력하세요"
            onChangeText={handleChangeEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            status={emailError ? 'error' : 'default'}
            helperText={emailError}
            utilityButton={emailUtility}
          />

          {verificationRequested && (
            <TextField
              label="인증번호"
              value={verificationCode}
              placeholder="인증번호 6자리를 입력하세요"
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              autoCapitalize="none"
              status={verificationError ? 'error' : 'default'}
              helperText={
                verificationError ??
                (timer === 0 ? '인증번호 유효시간이 만료되었습니다.' : undefined)
              }
              utilityButton={verificationUtility}
              accessory={<MDText type="caption1Regular">{formattedTimer}</MDText>}
            />
          )}

          {isCodeVerified && (
            <TextField
              label="비밀번호"
              value={form.password}
              placeholder="비밀번호를 입력하세요"
              onChangeText={handleChangePassword}
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
              status={passwordError ? 'error' : 'default'}
              helperText={passwordError}
              utilityButton={passwordUtility}
            />
          )}
        </MDView>

        <MDView style={{ width: '100%', paddingHorizontal: 20 }}>
          <MDButton title="회원가입" disabled={!canSubmit} onPress={handleSignUp} />
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
      alignItems: 'center',
      paddingBottom: 20 - bottomInset,
      backgroundColor: colors.background.normal,
    },
    content: {
      width: '100%',
      flex: 1,
      gap: 20,
      paddingTop: 24,
      paddingHorizontal: 20,
    },
  });

type TextFieldStatus = 'default' | 'error';

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  status?: TextFieldStatus;
  helperText?: string;
  utilityButton?: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
  };
  accessory?: ReactNode;
}

function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  autoCapitalize,
  autoCorrect,
  status = 'default',
  helperText,
  utilityButton,
  accessory,
}: TextFieldProps) {
  const colors = useThemeColor();
  const styles = textFieldStyles({ colors, status });

  return (
    <MDView style={styles.wrapper}>
      <MDText type="labelRegular" style={styles.label}>
        {label}
      </MDText>
      <MDView style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          placeholderTextColor={colors.text.alternative}
          style={styles.input}
        />

        {accessory}

        {utilityButton && (
          <MDPressable
            style={[styles.utilityButton, utilityButton.disabled && styles.utilityButtonDisabled]}
            disabled={utilityButton.disabled}
            onPress={utilityButton.onPress}>
            <MDText
              type="caption1Regular"
              style={[
                styles.utilityButtonText,
                utilityButton.disabled && styles.utilityButtonTextDisabled,
              ]}>
              {utilityButton.label}
            </MDText>
          </MDPressable>
        )}
      </MDView>

      {helperText ? (
        <MDText type="caption1Regular" style={styles.helperText}>
          {helperText}
        </MDText>
      ) : null}
    </MDView>
  );
}

const textFieldStyles = ({ colors, status }: { colors: MDColors; status: TextFieldStatus }) =>
  StyleSheet.create({
    wrapper: {
      gap: 8,
    },
    label: {
      color: colors.text.normal,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderColor: status === 'error' ? colors.primary.normal : colors.line.alternative,
      backgroundColor: colors.fill.normal,
    },
    input: {
      flex: 1,
      color: colors.text.normal,
      padding: 0,
    },
    utilityButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.primary.softer,
    },
    utilityButtonDisabled: {
      backgroundColor: colors.fill.alternative,
    },
    utilityButtonText: {
      color: colors.text.brand,
    },
    utilityButtonTextDisabled: {
      color: colors.text.alternative,
    },
    helperText: {
      color: status === 'error' ? colors.primary.normal : colors.text.alternative,
    },
  });

const fakeRequestVerification = async (email: string) => {
  await delay(800);

  if (email.toLowerCase().includes('exists')) {
    return { ok: false, message: '이미 가입된 이메일입니다.' };
  }

  return { ok: true };
};

const fakeVerifyCode = async (code: string) => {
  await delay(500);

  if (code.trim() === '123456') {
    return { ok: true };
  }

  return { ok: false, message: '인증번호가 일치하지 않습니다.' };
};

const fakeSignUp = async ({ email, password }: SignUpForm) => {
  await delay(1000);

  if (password.toLowerCase().includes('fail')) {
    return { ok: false };
  }

  return { ok: true };
};

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const formatTimer = (seconds: number) => {
  if (seconds <= 0) return '00:00';

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return `${mm}:${ss}`;
};
