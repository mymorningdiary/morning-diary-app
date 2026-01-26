import { Dispatch, RefObject, SetStateAction, useEffect } from 'react';
import { ReturnKeyType, StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';

import { confirmPassword, PASSWORD_MAX_LEN, validatePassword } from '@shared/lib/validation';
import { MDFieldState, MDTextField } from '@shared/ui/TextField';

interface Props {
  style?: StyleProp<ViewStyle>;
  password1: MDFieldState;
  password2: MDFieldState;
  password1Ref?: RefObject<TextInput | null>;
  password2Ref?: RefObject<TextInput | null>;
  nextFieldRef?: RefObject<TextInput | null>;
  password2ReturnKeyType?: ReturnKeyType;
  setPassword1: Dispatch<SetStateAction<MDFieldState>>;
  setPassword2: Dispatch<SetStateAction<MDFieldState>>;
  setVerifiedPassword?: Dispatch<SetStateAction<boolean>>;
  onSubmit?: () => void;
}

export function PasswordForm({
  style,
  password1,
  password2,
  password1Ref,
  password2Ref,
  password2ReturnKeyType = 'done',
  setPassword1,
  setPassword2,
  setVerifiedPassword,
  onSubmit,
}: Props) {
  const styles = FormStyles;

  const validatePassword2 = (nextPassword1: string, nextPassword2: string) => {
    const { isSame, message } = confirmPassword(nextPassword1, nextPassword2);
    if (!isSame) {
      return { status: 'error', message } as const;
    }

    const { isValid } = validatePassword(nextPassword2);
    return {
      status: isValid ? 'success' : 'error',
      message: isValid ? message : '사용 불가능한 비밀번호에요 (영문자+숫자+특수문자 10-64자)',
    } as const;
  };

  const handlePassword1Change = (value: string) => {
    const password2Value = password2.value;
    if (password2Value && password2Value.length > 0) {
      setPassword2((prev) => ({
        ...prev,
        ...validatePassword2(value, password2Value),
      }));
    }

    if (value.length === 0) {
      setPassword1({ value, status: 'default', message: null });
      return;
    }

    const { isValid } = validatePassword(value);
    setPassword1({
      value,
      status: isValid ? 'success' : 'error',
      message: isValid
        ? '사용 가능한 비밀번호에요'
        : '사용 불가능한 비밀번호에요 (영문자+숫자+특수문자 10-64자)',
    });
  };

  const handlePassword2Change = (value: string) => {
    if (value.length === 0) {
      setPassword2({ value, status: 'default', message: null });
      return;
    }

    setPassword2({
      value,
      ...validatePassword2(password1.value ?? '', value),
    });
  };

  useEffect(() => {
    const isVerified = password1.status === 'success' && password2.status === 'success';
    setVerifiedPassword?.(isVerified);
  }, [password1.status, password2.status, setVerifiedPassword]);

  return (
    <View style={[styles.container, style]}>
      <MDTextField
        ref={password1Ref}
        label="비밀번호"
        placeholder="영문,숫자,특수문자 포함 10자리 이상"
        secureTextEntry
        returnKeyType="next"
        maxLength={PASSWORD_MAX_LEN}
        {...password1}
        onChangeText={handlePassword1Change}
        onSubmitEditing={() => setTimeout(() => password2Ref?.current?.focus(), 0)}
      />

      <MDTextField
        ref={password2Ref}
        label="비밀번호 확인"
        placeholder="영문,숫자,특수문자 포함 10자리 이상"
        secureTextEntry
        returnKeyType={password2ReturnKeyType}
        maxLength={PASSWORD_MAX_LEN}
        {...password2}
        onChangeText={handlePassword2Change}
        onSubmitEditing={onSubmit}
      />
    </View>
  );
}

const FormStyles = StyleSheet.create({
  container: {
    gap: 24,
  },
});
