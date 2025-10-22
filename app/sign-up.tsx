import { MDView } from '@/components';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SignUpForm {
  email: string | null;
  password: string | null;
}

export default function SignUpScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = ScreenStyles({ colors, bottomInset: insets.bottom });

  const [form, setForm] = useState<SignUpForm>({
    email: null,
    password: null,
  });

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <MDView style={styles.container}></MDView>
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
      paddingHorizontal: 20,
      paddingBottom: 20 - bottomInset,
      backgroundColor: colors.background.normal,
    },
  });
