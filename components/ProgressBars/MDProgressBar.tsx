import { useThemeColor } from '@/hooks';
import { MDColors } from '@/types';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { MDView } from '../MDView';
import ProgressBarThumb from './ProgressBarThumb';

type MDProgressBarProps = {
  progress: number;
};

export default function MDProgressBar({ progress }: MDProgressBarProps) {
  const colors = useThemeColor();
  const styles = useMemo(() => ProgressBarStyles({ colors, progress }), [colors, progress]);

  return (
    <MDView style={styles.wrapper}>
      <MDView style={styles.container}>
        <MDView style={[styles.fill, { width: `${progress}%` }]} />
        <ProgressBarThumb progress={progress} />
      </MDView>
    </MDView>
  );
}

const ProgressBarStyles = ({ colors, progress }: { colors: MDColors; progress: number }) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      paddingHorizontal: 24,
    },
    container: {
      height: 16,
      borderRadius: 12,
      backgroundColor: colors.fill.alternative,
    },
    fill: {
      height: '100%',
      backgroundColor: colors.primary.light,
      borderRadius: 12,
    },
  });
