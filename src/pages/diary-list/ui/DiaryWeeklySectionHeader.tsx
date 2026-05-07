import { useThemeColor } from '@shared/lib/theme';
import { MDText } from '@shared/ui/Text';
import { StyleSheet, View } from 'react-native';

interface Props {
  title: string;
}

export function DiaryWeeklySectionHeader({ title }: Props) {
  const colors = useThemeColor();

  return (
    <View style={styles.container}>
      <MDText type="labelRegular" color={colors.text.alternative}>
        {title}
      </MDText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    paddingHorizontal: 16,
  },
});
