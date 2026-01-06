import ImgSunBasic from '@assets/images/img-sun-basic.svg';
import ImgTextLogo from '@assets/images/img-text-logo.svg';
import IconMail from '@assets/images/ic-mail.svg';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TermsTextBox } from './TermsTextBox';
import { MDButton } from '@shared/ui/MDButton';

export function LoginPage() {
  const colors = useThemeColor();
  const styles = PageStyles({ colors });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <ImgSunBasic />
        <ImgTextLogo />
      </View>

      <View style={styles.footerContainer}>
        <MDButton variant="secondary" label="이메일로 계속하기" prefix={IconMail} />
        <TermsTextBox />
      </View>
    </SafeAreaView>
  );
}

const PageStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    logoContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    footerContainer: {},
  });
