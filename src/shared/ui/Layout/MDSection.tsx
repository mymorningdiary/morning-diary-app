import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { MDText } from '@shared/ui/Text';
import { useThemeColor } from '@shared/lib/theme';

interface Props extends PropsWithChildren {
  title?: string;
  isLast?: boolean;
}

export function MDSection({ title, children, isLast = false }: Props) {
  const colors = useThemeColor();
  const styles = SectionStyles;

  return (
    <>
      <View style={styles.container}>
        {title && (
          <View style={styles.titleContent}>
            <MDText type="labelSemiBold">{title}</MDText>
          </View>
        )}

        {children}
      </View>
      {!isLast && <View style={[styles.divider, { backgroundColor: colors.line.normal }]} />}
    </>
  );
}

const SectionStyles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  titleContent: {
    height: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
});
