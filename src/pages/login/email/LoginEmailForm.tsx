import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';

import { useState } from 'react';
import MDTextField from '@shared/ui/TextField/MDTextField';
import { MDButton } from '@shared/ui/Button';
import { MDText } from '@shared/ui/Text';

interface Props {
  onGoSignUp?: () => void;
  onGoResetPassword?: () => void;
  bottomSpacing?: number;
}

export function LoginEmailForm({ onGoSignUp, onGoResetPassword, bottomSpacing = 0 }: Props) {
  const colors = useThemeColor();
  const styles = FormStyles({ colors });

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const handleSubmit = () => {};

  return (
    <>
      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.textFieldContent}>
          <MDTextField
            label="아이디"
            placeholder="이메일 주소"
            returnKeyType="next"
            keyboardType="email-address"
            value={email}
            onChangeText={(s) => setEmail(s)}
          />

          <MDTextField
            label="비밀번호"
            placeholder="비밀번호"
            secureTextEntry
            returnKeyType="done"
            value={password}
            onChangeText={(s) => setPassword(s)}
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
