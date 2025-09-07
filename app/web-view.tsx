import { MDPressable, MDRow } from '@/components';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function WebViewScreen() {
  const colors = useThemeColor();
  const styles = ScreenStyles({ colors });

  const onNavigateToBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <MDRow style={styles.containerAppBar}>
        <MDPressable style={styles.buttonClose} onPress={onNavigateToBack}>
          <Image source={require('@/assets/images/ic-close.png')} />
        </MDPressable>
      </MDRow>

      <WebView style={styles.containerWebView} source={{ uri: 'https://expo.dev' }} />
    </SafeAreaView>
  );
}

const ScreenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    containerSafeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    containerWebView: {
      flex: 1,
    },
    containerAppBar: {
      height: 48,
    },
    buttonClose: {
      height: '100%',
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
