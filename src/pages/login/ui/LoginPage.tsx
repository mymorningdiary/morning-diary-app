import { IconKakao, IconMail } from '@assets/icons';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDButton } from '@shared/ui/MDButton';
import { MDLogo } from '@shared/ui/MDLogo/ui/MDLogo';
import { MDPage } from '@shared/ui/MDPage';
import { StyleSheet, View } from 'react-native';
import { TermsTextBox } from './TermsTextBox';

export function LoginPage() {
  const colors = useThemeColor();
  const styles = PageStyles({ colors });

  return (
    <MDPage style={styles.container}>
      <MDLogo style={styles.logoContent} />

      <View style={styles.buttonContent}>
        <MDButton variant="outline" label="이메일로 계속하기" prefix={IconMail} />
        <MDButton variant="kakao" label="카카오로 계속하기" prefix={IconKakao} />
      </View>

      <TermsTextBox />
    </MDPage>
  );
}

const PageStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.normal,
      paddingBottom: 60,
    },
    logoContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'stretch',
    },
    buttonContent: {
      paddingHorizontal: 16,
      gap: 10,
      marginBottom: 24,
    },
  });
