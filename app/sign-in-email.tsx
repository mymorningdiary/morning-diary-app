import { MDButton } from '@/components';
import MDTextField from '@/components/MDTextField';
import { useAppState } from '@/contexts/AppStateContext';
import SignInAppBar from '@/domain/sign-in/components/SignInAppBar';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MAX_PASSWORD_LEN = 15;

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[!@#$%^+=-])(?=.*[0-9]).{8,15}$/;

interface FormFieldState {
  value: string;
  helperText: string | null;
  isValid: boolean;
}

export default function SignInEmailScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = ScreenStyles({ colors, bottomInset: insets.bottom });

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const { setAuthToken } = useAppState();

  const [email, setEmail] = useState<FormFieldState>({
    value: '',
    helperText: null,
    isValid: false,
  });
  const [password, setPassword] = useState<FormFieldState>({
    value: '',
    helperText: null,
    isValid: false,
  });

  const handleChangeEmail = (value: string) => {
    setEmail({ value, helperText: null, isValid: false });
  };

  const handleChangePassword = (value: string) => {
    const isValid = PASSWORD_REGEX.test(value);
    setPassword({ value, helperText: null, isValid: false });
  };

  const handleSignIn = async () => {
    try {
    } catch (error: any) {
      console.error('Failed to verify otp', error);
    }
  };

  const navigateToSignUp = () => {
    router.push({
      pathname: '/sign-up',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SignInAppBar onNavigateBack={() => router.back()} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled">
          <MDTextField
            ref={emailRef}
            label="아이디"
            placeholder="이메일 주소"
            returnKeyType="next"
            keyboardType="email-address"
            inputMode="email"
            {...email}
            onChangeText={handleChangeEmail}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <MDTextField
            ref={passwordRef}
            label="비밀번호"
            placeholder="비밀번호"
            maxLength={MAX_PASSWORD_LEN}
            secureTextEntry
            returnKeyType="done"
            {...password}
            onChangeText={handleChangePassword}
            onSubmitEditing={handleSignIn}
          />
        </ScrollView>

        <View style={styles.footer}>
          <MDButton title={'로그인'} onPress={handleSignIn} />
          <MDButton
            style={styles.signUpButton}
            textStyle={styles.signUpButtonText}
            title={'회원가입'}
            onPress={navigateToSignUp}
          />
        </View>
      </KeyboardAvoidingView>
      {false && (
        <View
          style={[StyleSheet.absoluteFillObject, styles.loading]}
          onStartShouldSetResponder={() => true}>
          <ActivityIndicator color={colors.primary.normal} size={'large'} />
        </View>
      )}
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
    footer: {
      paddingTop: 16,
      paddingHorizontal: 16,
      paddingBottom: 60 - bottomInset,
      gap: 10,
    },
    loading: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    signUpButton: {
      backgroundColor: colors.fill.normal,
      borderWidth: 1,
      borderColor: colors.line.alternative,
    },
    signUpButtonText: {
      color: colors.text.normal,
    },
  });
