import { StyleSheet, View } from 'react-native';

import { MDColorsType, useThemeColor } from '@shared/lib/theme';
import { MDListItem, MDSection } from '@shared/ui/Layout';

interface Props {
  isLast?: boolean;
}

export function AccountManagementSection({ isLast }: Props) {
  const colors = useThemeColor();
  const styles = Styles({ colors });

  return (
    <MDSection isLast={isLast}>
      <MDListItem label="로그아웃" />
    </MDSection>
  );
}

const Styles = ({ colors }: { colors: MDColorsType }) =>
  StyleSheet.create({
    container: {},
  });
