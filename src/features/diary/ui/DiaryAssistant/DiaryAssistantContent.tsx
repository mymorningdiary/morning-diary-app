import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';

interface Props {
  image: string;
  message: string;
}

export function DiaryAssistantContent({ image, message }: Props) {
  const colors = useThemeColor();
  const styles = ContentStyles({ colors });

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={image} />
      <MDText
        style={styles.message}
        type="labelSemiBold"
        color={colors.text.brand}
        numberOfLines={2}
        ellipsizeMode="tail">
        {message}
      </MDText>
    </View>
  );
}

const ContentStyles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.fill.normal,
      borderRadius: 16,
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
      // iOS shadow
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      // Android shadow
      elevation: 3,
    },
    image: {
      width: 48,
      height: 48,
    },
    message: {
      flexShrink: 1,
    },
  });
