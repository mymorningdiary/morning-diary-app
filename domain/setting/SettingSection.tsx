import { MDCol, MDRow, MDText } from '@/components';
import { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

interface Props extends PropsWithChildren {
  title: string;
}

export default function SettingSection({ title, children }: Props) {
  const styles = SectionStyles;

  return (
    <MDCol style={styles.container}>
      <MDRow style={styles.containerTitle}>
        <MDText type="labelSemiBold">{title}</MDText>
      </MDRow>

      {children}
    </MDCol>
  );
}

const SectionStyles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  containerTitle: {
    height: 44,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
