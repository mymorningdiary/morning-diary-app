import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { ImgSunBasic, ImgTextLogo } from '@assets/images';
import { Image } from 'expo-image';

interface MDLogoProps {
  style?: StyleProp<ViewStyle>;
}

export function MDLogo({ style }: MDLogoProps) {
  const styles = LogoStyles;

  return (
    <View style={[styles.container, style]}>
      <Image contentFit="contain" source={ImgSunBasic} style={{ width: 93, height: 93 }} />
      <Image contentFit="contain" source={ImgTextLogo} style={{ width: 105, height: 44 }} />
    </View>
  );
}

const LogoStyles = StyleSheet.create({
  container: {
    gap: 4,
    alignSelf: 'flex-start',
  },
});
