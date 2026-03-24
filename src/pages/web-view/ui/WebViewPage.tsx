import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { getSingleParam } from '@shared/lib/router';
import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDAppBar } from '@shared/ui/AppBar';
import { MDPage } from '@shared/ui/Layout';
import { MDText } from '@shared/ui/Text';

export function WebViewPage() {
  const colors = useThemeColor();
  const styles = PageStyles({ colors });

  const { webviewURL } = useLocalSearchParams<{ webviewURL?: string | string[] }>();
  const webviewURLParam = getSingleParam(webviewURL);

  const [isLoading, setIsLoading] = useState(true);

  return (
    <MDPage>
      <MDAppBar onBack={() => router.back()} />

      {!webviewURLParam ? (
        <View style={styles.errorContent}>
          <MDText align="center">페이지를 불러올 수 없습니다</MDText>
        </View>
      ) : (
        <View style={styles.content}>
          <WebView
            style={styles.webView}
            source={{ uri: webviewURLParam }}
            onLoadEnd={() => setIsLoading(false)}
          />

          {isLoading && (
            <View style={styles.loadingContent}>
              <ActivityIndicator color={colors.primary.normal} />
            </View>
          )}
        </View>
      )}
    </MDPage>
  );
}

const PageStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    content: {
      flex: 1,
    },
    webView: {
      flex: 1,
    },
    loadingContent: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      backgroundColor: colors.background.normal,
    },
  });
