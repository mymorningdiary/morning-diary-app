import { MDText } from '@/components';
import AppBar from '@/domain/web-view/AppBar';
import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function WebViewScreen() {
  const colors = useThemeColor();
  const styles = ScreenStyles({ colors });

  const { webviewURL } = useLocalSearchParams<{ webviewURL: string }>();
  const [isLoading, setLoading] = useState(true);

  const onLoadEnd = () => {
    setLoading(false);
  };

  if (!webviewURL) {
    return (
      <SafeAreaView style={styles.containerSafeArea}>
        <View style={styles.container}>
          <AppBar />

          <View style={styles.containerError}>
            <MDText align="center">페이지를 불러올 수 없습니다.</MDText>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <View style={styles.container}>
        <AppBar />

        <WebView
          style={styles.containerWebView}
          source={{ uri: webviewURL }}
          onLoadEnd={onLoadEnd}
        />

        {isLoading && (
          <View style={styles.containerLoading}>
            <ActivityIndicator color={colors.primary.normal} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const ScreenStyles = ({ colors }: { colors: MDColors }) =>
  StyleSheet.create({
    containerSafeArea: {
      flex: 1,
      backgroundColor: colors.background.normal,
    },
    container: {
      flex: 1,
    },
    containerLoading: {
      flex: 1,
      position: 'absolute',
      top: 48,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignContent: 'center',
    },
    containerWebView: {
      flex: 1,
    },
    containerError: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
    },
  });
